import req from '@/utils/request'

export const LoginService = {
  login: (params) => req.post('/login/do', params),
  getCode: (params) => req.post('/login/shortMessage', params)
}
