import bcrypt from "bcrypt";

export async function hashPassword(pass:string){
    const salt =bcrypt.genSaltSync(14)
    return await bcrypt.hash(pass, salt )
}

export async function hashCompare(pass:string, passHash:string) {
   return await bcrypt.compare(pass, passHash);
   
}
