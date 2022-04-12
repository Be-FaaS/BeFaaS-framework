output "project_name" {
  value = local.project_name
}

output "build_id" {
  value = random_string.build_id.result
}

output "deployment_id" {
  value = random_string.deployment_id.result
}

output "aws_fns" {
  value = local.aws_fns
}

output "aws_fns_async" {
  value = local.aws_fn_names_async
}

output "google_fns" {
  value = local.google_fns
}

output "tinyfaas_fns" {
  value = local.tinyfaas_fns
}

output "openfaas_fns" {
  value = local.openfaas_fn_names
}

output "openwhisk_fns" {
  value = local.openwhisk_fns
}

output "azure_fn_file" {
  value = local.azure_fn_file
}
