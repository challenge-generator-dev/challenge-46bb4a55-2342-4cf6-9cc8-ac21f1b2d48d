# Configuración de providers para Terraform
# Este archivo define los providers necesarios para desplegar la infraestructura
# en AWS y sus versiones correspondientes.

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.40.0"
    }
  }
  required_version = ">= 1.7.0"
}

# Provider principal para AWS
# Configura la región por defecto y permite asumir roles para despliegues en
# diferentes entornos.
provider "aws" {
  region = var.aws_region

  # Permitir la asunción de roles para entornos específicos
  dynamic "assume_role" {
    for_each = var.aws_assume_role_arn != "" ? [1] : []
    content {
      role_arn = var.aws_assume_role_arn
    }
  }
}

# Variables esperadas por este provider
# Estas variables se definen en variables.tf y se pasan desde el entorno

# Outputs para exponer información útil del provider
# Estos outputs pueden ser utilizados por otros módulos o configuraciones