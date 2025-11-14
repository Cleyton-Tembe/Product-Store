import { create } from "zustand"


export const useProductStore = create((set) => ({
    products:[],
    setProducts: (products) => set({ products }),
    createProduct: async (newProduct) => {
        if(!newProduct.name || !newProduct.price || !newProduct.image) {
            return {sucess: false, message: "Fill all fields"}
        }

        const response = await fetch("/api/products", {
            method: "post",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(newProduct),
        })

        const newdata = await response.json();
        set((state) => ({products:[...state.products, newdata.data]}))
        
        return{ sucess: true, message: "Operation Completed"}
    },
    fetchProducts: async () => {

        const response = await fetch('/api/products/All',{
            method: 'get',
            headers: {
                "content-type" : "application/json"
            },
        })

        const data = await response.json()
        set({products: data.data})
    },
    deleteProduct: async (id) => {
        const response = await fetch(`/api/products/delete/${id}`,{
            method: 'delete',
            headers: {
                "content-type" : "application/json"
            }
        })

        const data = await response.json()

        if(!data.sucess) return {sucess: false, message: data.message}

        set(prev => ({products: prev.products.filter(prd => prd._id !== id)}))

        return {sucess: true, message: data.message}
    },
    
    updateProduct: async (id, updated) => {

        const response = await fetch(`/api/products/update/${id}`,{
            method: 'PATCH',
            headers: {
                "content-type" : "application/json"
            },
            body: JSON.stringify(updated),
        })

        const updatedData = await response.json()

        if(!updatedData && !updatedData.sucess) return { sucess: false, message: updatedData.message}

        set( prev => ({products: prev.products.map(p => {
            if(p._id === id){
                return p = updatedData.data
            }else{
                return p
            }
        } )}) )

        return {sucess: true, message: updatedData.message, }
    }
}))