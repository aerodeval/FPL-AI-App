export async function getFplData(){

    const response = await fetch('http://localhost:5000/api/fpl');
    if(!response.ok){
        throw new Error("No Data Received, Server Issue")
    }
    
    return await response.json();
}