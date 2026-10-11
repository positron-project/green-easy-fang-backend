export type activeType = 'login' | 'register' | 'forgetPassword'

export interface loginPrefillType {
    type: 'login'
    youxiang: string
    password: string
}