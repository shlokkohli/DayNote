import 'next-auth'

declare module 'next-auth' {
    interface User {
        name: string,
        id: string
    }

    interface Session {
        user: {
            name: string,
            id: string
        }
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        name: string,
        id: string
    }
}