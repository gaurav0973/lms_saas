"use server"

import { auth } from "@clerk/nextjs/server"
import { CreateSupabaseClient } from "../supabase"

export const createCompanion = async (formData :CreateCompanion) => {
    
    // user 
    const {userId : author } = await auth()

    // database
    const superbase = CreateSupabaseClient()

    // db thing
    const {data , error} = await superbase
        .from("companions")
        .insert({...formData, author})
        .select()
    
    console.log(data)

    if(error || !data){
        throw new Error(error?.message || "Failed to load companion")
    }
    return data[0];

}