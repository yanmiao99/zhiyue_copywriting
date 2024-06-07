import { getQAList, addQA, deleteQA, checkQADetail } from '@/services/HelpArticleManage'

export default () => {
  const GetQAList = <T>(data: T) => {
    return getQAList(data)
  }

  const AddQA = <T>(data: T) => {
    return addQA(data)
  }

  const DeleteQA = <T>(data: T) => {
    return deleteQA(data)
  }

  const CheckQADetail = <T>(data: T) => {
    return checkQADetail(data)
  }

  return {
    GetQAList,
    AddQA,
    DeleteQA,
    CheckQADetail
  }
}
