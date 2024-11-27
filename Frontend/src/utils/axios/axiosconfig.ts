import axios from 'axios'

const api=axios.create({ 
    baseURL: 'http://localhost:3001',
    withCredentials:true
})

const hostApi=axios.create({ 
    baseURL: 'http://localhost:3001/host',
    withCredentials:true
})
const adminApi=axios.create({ 
    baseURL: 'http://localhost:3001/admin',
    withCredentials:true
})
const getcookie=(name: string): string | null =>{
    const nameEQ = name + "=";
    const cookies = document.cookie.split(';');
    
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.startsWith(nameEQ)) {
            console.log("yoooo",cookie.substring(nameEQ.length));
            
            return cookie.substring(nameEQ.length);
        }
    }
    return null;
}
export{
    api,
    hostApi,
    getcookie,
    adminApi
}
