# Outputs del módulo DynamoDB para consumir en otros módulos
# Exponen información crítica de la tabla creada

output "table_name" {
  description = "Nombre de la tabla DynamoDB"
  value       = aws_dynamodb_table.this.name
}

output "table_id" {
  description = "Identificador único de la tabla"
  value       = aws_dynamodb_table.this.id
}

output "table_arn" {
  description = "ARN completo de la tabla DynamoDB"
  value       = aws_dynamodb_table.this.arn
}

output "table_stream_arn" {
  description = "ARN del stream de DynamoDB (si está habilitado)"
  value       = try(aws_dynamodb_table.this.stream_arn, "")
  sensitive   = false
}

output "table_endpoint" {
  description = "Endpoint de la tabla para conexión"
  value       = "https://dynamodb.${var.region}.amazonaws.com"
}

output "table_region" {
  description = "Región donde se creó la tabla"
  value       = var.region
}

output "billing_mode" {
  description = "Modo de facturación de la tabla"
  value       = aws_dynamodb_table.this.billing_mode
}

output "hash_key_attribute_name" {
  description = "Nombre del atributo de clave de partición"
  value       = aws_dynamodb_table.this.hash_key
}

output "range_key_attribute_name" {
  description = "Nombre del atributo de clave de ordenación"
  value       = aws_dynamodb_table.this.range_key
}

output "global_secondary_index_names" {
  description = "Lista de nombres de índices secundarios globales"
  value       = [for gsi in aws_dynamodb_table.this.global_secondary_index : gsi.name]
}

output "tags" {
  description = "Etiquetas aplicadas a la tabla"
  value       = aws_dynamodb_table.this.tags
}