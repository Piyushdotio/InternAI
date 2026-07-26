const TOKEN_KEY = "token"
const USER_KEY = "user"

export interface StoredUser {
    id: string,
    username: string,
    email: string,
    createdAt:string
}

export const getToken = () => {
    if (typeof window === "undefined") return null
    return localStorage.getItem(TOKEN_KEY)
}
export const setToken = (token: string): void => {
    if (typeof window === "undefined") return
    localStorage.setItem(TOKEN_KEY, token)
}
export const removeToken = () => {
    if (typeof window === "undefined") return
    localStorage.removeItem(TOKEN_KEY)
}
export const getUser = (user: any) => {
    if (typeof window === "undefined") return null
    return localStorage.getItem(USER_KEY)
}
export const setUser = (user: StoredUser): void => {
    if (typeof window === "undefined") return
    localStorage.setItem(USER_KEY, JSON.stringify(user))
}
export const removeUser = () => {
    if (typeof window === "undefined") return
    localStorage.removeItem(USER_KEY)
}
export const clearAuth = () => {
    removeToken()
    removeUser()
    if (typeof window !== "undefined") {
        localStorage.removeItem("ai_interview_history")
        localStorage.removeItem("ai_resume_analysis")
        localStorage.removeItem("resume_analysis_result")
        localStorage.removeItem("resume_file_name")
    }
}