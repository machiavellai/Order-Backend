import bcrypt from 'bcrypt'
import  jwt  from 'jsonwebtoken'

export const GenerateSalt = async () => {
    return await bcrypt.genSalt()
}

export const GeneratePassword = async (password: string, salt: string) => {
    return await bcrypt.hash(password, salt);
}

export const ValidatePassword = async (enteredPassword: string, savedPassword: string, salt: string) => {
    return await GeneratePassword(enteredPassword, salt) === savedPassword
}

//implementing jwt to serve as a code to all endpoints that requireauthentication

export const GenerateSignature = (payload: any) => {

    
}