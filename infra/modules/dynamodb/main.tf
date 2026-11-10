terraform {
  # Este módulo crea una tabla de DynamoDB para persistir órdenes
  # Soporta: GSI, TTL, Streams, Encriptación KMS
}

resource "aws_dynamodb_table" "this" {
  name           = var.table_name
  billing_mode   = var.billing_mode
  hash_key       = var.hash_key
  range_key      = var.range_key != "" ? var.range_key : null
  read_capacity  = var.billing_mode == "PROVISIONED" ? var.read_capacity : null
  write_capacity = var.billing_mode == "PROVISIONED" ? var.write_capacity : null

  # Habilitar streams de DynamoDB para captura de cambios
  stream_enabled   = var.enable_stream
  stream_view_type = var.enable_stream ? var.stream_view_type : null

  # Definición de atributos de la tabla
  dynamic "attribute" {
    for_each = var.attributes
    content {
      name = attribute.value.name
      type = attribute.value.type
    }
  }

  # Índices secundarios globales (GSI)
  dynamic "global_secondary_index" {
    for_each = var.global_secondary_indexes
    content {
      name               = global_secondary_index.value.name
      hash_key           = global_secondary_index.value.hash_key
      range_key          = lookup(global_secondary_index.value, "range_key", null)
      projection_type    = global_secondary_index.value.projection_type
      non_key_attributes = lookup(global_secondary_index.value, "non_key_attributes", [])
      read_capacity      = var.billing_mode == "PROVISIONED" ? lookup(global_secondary_index.value, "read_capacity", var.read_capacity) : null
      write_capacity     = var.billing_mode == "PROVISIONED" ? lookup(global_secondary_index.value, "write_capacity", var.write_capacity) : null
    }
  }

  # Time-to-Live (TTL) para expiración automática de ítems
  dynamic "ttl" {
    for_each = var.ttl_attribute != "" ? [var.ttl_attribute] : []
    content {
      attribute_name = var.ttl_attribute
      enabled        = true
    }
  }

  # Encriptación del lado del servidor
  server_side_encryption {
    enabled     = var.server_side_encryption_enabled
    kms_key_arn = var.server_side_encryption_kms_key_arn != "" ? var.server_side_encryption_kms_key_arn : null
  }

  # Etiquetas para identificación y gestión
  tags = var.tags

  # Configuración de punto de tiempo de recuperación
  point_in_time_recovery {
    enabled = true
  }

  # Configuración de capacidad bajo demanda (si aplica)
  dynamic "replica" {
    for_each = var.aws_region != "us-east-1" && var.billing_mode == "PAY_PER_REQUEST" ? [1] : []
    content {
      region_name = var.aws_region
    }
  }
}

# Recurso auxiliar para obtener el ARN del recurso de la tabla
# Se usa para referenciar correctamente en políticas IAM
data "aws_dynamodb_table" "this" {
  name = aws_dynamodb_table.this.name
}