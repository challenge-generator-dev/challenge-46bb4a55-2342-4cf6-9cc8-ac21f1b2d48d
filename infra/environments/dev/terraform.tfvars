environment         = "dev"
aws_region          = "us-east-1"
aws_assume_role_arn = ""

dynamodb_table_name     = "orders-dev"
dynamodb_billing_mode   = "PAY_PER_REQUEST"
dynamodb_read_capacity  = 5
dynamodb_write_capacity = 5
dynamodb_hash_key       = "order_id"
dynamodb_range_key      = ""
dynamodb_ttl_attribute  = "expiry_time"

dynamodb_attributes = [
  {
    name = "order_id"
    type = "S"
  },
  {
    name = "customer_id"
    type = "S"
  },
  {
    name = "status"
    type = "S"
  },
  {
    name = "created_at"
    type = "S"
  }
]

dynamodb_global_secondary_indexes = []

dynamodb_tags = {
  Environment = "dev"
  Project     = "orders-management"
  ManagedBy   = "terraform"
}

iam_policy_name        = "dynamodb-orders-dev-policy"
iam_role_name          = "dynamodb-orders-dev-role"
iam_policy_description = "Política para acceso a la tabla DynamoDB de órdenes en entorno dev"