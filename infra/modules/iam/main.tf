# Módulo IAM para crear políticas y roles de acceso a DynamoDB
# Proporciona permisos granulares para operaciones CRUD sobre la tabla de órdenes

# Política IAM para acceso completo a la tabla de órdenes
resource "aws_iam_policy" "dynamodb_access" {
  name        = var.iam_policy_name
  description = var.iam_policy_description

  # Policy document con permisos específicos para DynamoDB
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      # Permiso para describir la tabla
      {
        Sid    = "DescribeTable"
        Effect = "Allow"
        Action = [
          "dynamodb:DescribeTable",
          "dynamodb:DescribeTimeToLive",
          "dynamodb:DescribeContinuousBackups",
          "dynamodb:DescribeBackup",
          "dynamodb:ListTagsOfResource"
        ]
        Resource = var.table_arn
      },
      # Permisos de lectura sobre la tabla
      {
        Sid    = "ReadOrders"
        Effect = "Allow"
        Action = [
          "dynamodb:GetItem",
          "dynamodb:Query",
          "dynamodb:Scan"
        ]
        Resource = [
          var.table_arn,
          "${var.table_arn}/index/*"
        ]
      },
      # Permisos de escritura sobre la tabla
      {
        Sid    = "WriteOrders"
        Effect = "Allow"
        Action = [
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
          "dynamodb:BatchWriteItem"
        ]
        Resource = var.table_arn
      },
      # Permisos para streams de DynamoDB (si están habilitados)
      {
        Sid    = "StreamAccess"
        Effect = "Allow"
        Action = [
          "dynamodb:GetRecords",
          "dynamodb:GetShardIterator",
          "dynamodb:ListStreams"
        ]
        Resource = "${var.table_arn}/stream/*"
      }
    ]
  })

  tags = var.tags
}

# Rol IAM que será asumido por las aplicaciones/funciones lambda
resource "aws_iam_role" "dynamodb_app_role" {
  name = var.iam_role_name

  # Asumir rol desde servicios de AWS (EC2, Lambda, ECS, etc.)
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = [
            "ec2.amazonaws.com",
            "lambda.amazonaws.com",
            "ecs-tasks.amazonaws.com",
            "apigateway.amazonaws.com"
          ]
        }
      }
    ]
  })

  tags = var.tags
}

# Adjuntar la política de DynamoDB al rol
resource "aws_iam_role_policy_attachment" "dynamodb_policy_attachment" {
  role       = aws_iam_role.dynamodb_app_role.name
  policy_arn = aws_iam_policy.dynamodb_access.arn
}

# Política adicional para CloudWatch Logs (necesaria para Lambda)
resource "aws_iam_policy" "cloudwatch_logs" {
  name        = "${var.iam_policy_name}-logs"
  description = "Política para acceso a CloudWatch Logs"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "arn:aws:logs:*:*:*"
      }
    ]
  })
}

# Adjuntar política de CloudWatch al rol
resource "aws_iam_role_policy_attachment" "cloudwatch_logs_attachment" {
  role       = aws_iam_role.dynamodb_app_role.name
  policy_arn = aws_iam_policy.cloudwatch_logs.arn
}

# Output: ARN de la política de DynamoDB
output "policy_arn" {
  description = "ARN de la política IAM de acceso a DynamoDB"
  value       = aws_iam_policy.dynamodb_access.arn
}

# Output: Nombre del rol IAM
output "role_name" {
  description = "Nombre del rol IAM para acceso a DynamoDB"
  value       = aws_iam_role.dynamodb_app_role.name
}

# Output: ARN del rol IAM
output "role_arn" {
  description = "ARN completo del rol IAM"
  value       = aws_iam_role.dynamodb_app_role.arn
}

# Output: ARN de la política de CloudWatch Logs
output "cloudwatch_policy_arn" {
  description = "ARN de la política IAM de CloudWatch Logs"
  value       = aws_iam_policy.cloudwatch_logs.arn
}