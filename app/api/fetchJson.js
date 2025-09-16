export async function fetchJson(api){

    try {
    const res = await fetch(api);
    if(!res.ok) throw new Error(`HTTP ${res.status} for ${api}`);

    return await res.json();
        
    } catch (error) {
        console.error("fetching issue",error);
        throw error      
    }
    
}