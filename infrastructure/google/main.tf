data "terraform_remote_state" "exp" {
  backend = "local"

  config = {
    path = "${path.module}/../experiment/terraform.tfstate"
  }
}

locals {
  project_name  = data.terraform_remote_state.exp.outputs.project_name
  build_id      = data.terraform_remote_state.exp.outputs.build_id
  deployment_id = data.terraform_remote_state.exp.outputs.deployment_id
  fns           = data.terraform_remote_state.exp.outputs.google_fns
  fns_async     = data.terraform_remote_state.exp.outputs.google_fns_async
}

resource "google_cloudfunctions_function" "fn" {
  for_each            = local.fns
  name                = each.key
  runtime             = "nodejs10"
  entry_point         = var.entry_point
  timeout             = var.timeout
  available_memory_mb = var.memory_size

  source_archive_bucket = google_storage_bucket.bucket.name
  source_archive_object = google_storage_bucket_object.source[each.key].name

  trigger_http = contains(local.fns_async, each.key) ? null : true
  
  dynamic "event_trigger" {
    for_each = contains(local.fns_async, each.key) ? [each.key] : []

    content {
      event_type = "google.pubsub.topic.publish"
      resource   = "${google_pubsub_topic.fn_topic[each.key].name}"
    }
  }
  
  depends_on = [google_pubsub_topic.fn_topic]

  environment_variables = merge({
    BEFAAS_DEPLOYMENT_ID = local.deployment_id
  }, var.fn_env)
}

resource "google_cloudfunctions_function_iam_member" "invoker" {
  for_each       = local.fns
  project        = google_cloudfunctions_function.fn[each.key].project
  region         = google_cloudfunctions_function.fn[each.key].region
  cloud_function = google_cloudfunctions_function.fn[each.key].name

  role   = "roles/cloudfunctions.invoker"
  member = "allUsers"
}

resource "google_pubsub_topic" "fn_topic" {
  for_each = toset(local.fns_async)
  name     = local.fns[each.key]
}
