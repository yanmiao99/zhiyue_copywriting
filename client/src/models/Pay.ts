import { createOrder, queryOrderPayStatus, checkUserBalance } from '@/services/Pay'
import { requestEncryption } from '@/utils/utils'

export default () => {
  const CreateOrder = async (data: any) => {
    let { blob, headers } = requestEncryption(data)
    return createOrder(blob, headers)
  }

  const QueryOrderPayStatus = async (data: any) => {
    let { blob, headers } = requestEncryption(data)
    return queryOrderPayStatus(blob, headers)
  }

  const CheckUserBalance = async (data: any) => {
    let { blob, headers } = requestEncryption(data)
    return checkUserBalance(blob, headers)
  }

  return {
    CreateOrder,
    QueryOrderPayStatus,
    CheckUserBalance
  }
}
