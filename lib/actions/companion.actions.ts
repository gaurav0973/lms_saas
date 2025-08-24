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



export const getAllCompanions = async ({limit =10, page=1, subject, topic} : GetAllCompanions) => {

    const supabase = CreateSupabaseClient()

    let query = supabase.from("companions").select()

    if(subject && topic){
        query = query.ilike("subject", `%${subject}%`)
                    .or(`topic.ilike.%${topic}%, name.ilike.%${topic}%`)
    }
    else if(subject){
        query = query.ilike("subject", `%${subject}%`)
    }
    else if(topic){
        query = query.or(`topic.ilike.%${topic}%, name.ilike.%${topic}%`)
    }


    query = query.range((page-1)*limit, page*limit-1)
    const {data : companions, error} = await query

    if(error)
        throw new Error(error?.message || "Failed to get All companions")

    return companions



}


export const getCompanion = async (id : string) => {

    const supabase = CreateSupabaseClient()
    const {data , error} = await supabase
                                        .from("companions")
                                        .select()
                                        .eq("id", id)

    if(error){
        throw new Error(error?.message || "Failed to get the companion")
    }

    return data[0]
}   



export const addToSessionHistory = async (CompanionId : string) => {
    const {userId} = await auth()
    const supabase = CreateSupabaseClient()
    const {data , error } = await supabase.from("session_history")
                                    .insert({
                                        companion_id : CompanionId,
                                        user_id : userId
                                    })
    
    if(error){
        throw new Error(error?.message)
    }

    return data
}


export const getRescentSessions  = async (limit=10) => {
    const supabase = CreateSupabaseClient()
    const {data, error} = await supabase.from("session_history")
                            .select(`companions:companion_id (*)`)
                            .order("created_at", {ascending:false})
                            .limit(limit)

    if(error){
        throw new Error(error?.message)
    }

    return data.map(({companions}) => companions)
}


export const getUserSession = async (userId : string, limit=10) => {
    const supabase = CreateSupabaseClient()
    const {data, error} = await supabase.from("session_history")
                            .select(`companions:companion_id (*)`)
                            .eq("user_id", userId)
                            .order("created_at", {ascending:false})
                            .limit(limit)

    if(error){
        throw new Error(error?.message)
    }

    return data.map(({companions}) => companions)
}


export const getUserCompanions = async (userId : string) => {
    const supabase = CreateSupabaseClient()
    const {data, error} = await supabase.from("companions")
                            .select()
                            .eq("author", userId)
                            

    if(error){
        throw new Error(error?.message)
    }

    return data
}

