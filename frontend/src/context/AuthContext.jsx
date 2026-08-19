import { createContext, useEffect, useState } from 'react'

export const AuthContext = createContext()

export function AuthProvider({children}) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    const checkAuth = async () => {
        try{
            const response = await fetch(
                "http://127.0.0.1:8000/auth/me",
                {
                    method: "GET",
                    credentials: "include",
                }
            )

            if (!response.ok){
                setUser(null)
                return
            }

            const data = await response.json()

            setUser(data)
        }
        catch {
            setUser(null)
        }
        finally {
            setLoading(false)
        }
    }

    const logout = async () => {
        try{
            await fetch(
                "http://127.0.0.1:8000/auth/logout",
                {
                    method: "POST",
                    credentials: "include",
                }
            )
        }
        catch (error) {
            console.error("Logout error: ", error)
        }
        finally {
            //remove user from frontend state
            setUser(null)
        }

    }

    useEffect(() => {
        const loadUser = async () => {
            await checkAuth()
        }

        loadUser()
    }, [])

    return(
        <AuthContext.Provider value ={{user, setUser, loading, checkAuth, logout}}>
            {children}
        </AuthContext.Provider>
    )
}