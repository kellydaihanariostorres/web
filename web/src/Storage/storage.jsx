export const storage = {
    get(key){
        const val = window.localStorage.getItem(key);
        if(!val){
            return null;
        }
        return JSON.parse(val);
    },
    set(key,val){
        window.localStorage.setItem(key,JSON.stringify(val));
    },
    remove(key){
        window.localStorage.removeItem(key);
    },
    clear(){
        window.localStorage.clear();
    }
}
export default storage;


////get(key): Este método recibe una clave como parámetro y devuelve el valor asociado a esa clave en el almacenamiento local. Primero, se intenta obtener el valor correspondiente a la clave
// utilizando window.localStorage.getItem(key). Si no se encuentra ningún valor para esa clave, devuelve null. De lo contrario, convierte el valor de cadena recuperado en un objeto JavaScript utilizando JSON.parse()
// y lo devuelve. set(key, val): Este método establece un valor en el almacenamiento local asociado con la clave proporcionada. Convierte el valor (val) a una cadena JSON utilizando JSON.stringify()
// y lo almacena en el almacenamiento local utilizando window.localStorage.setItem(key, JSON.stringify(val)). remove(key): Este método elimina la entrada asociada con la clave especificada del almacenamiento local 
//utilizando window.localStorage.removeItem(key). clear(): Este método elimina todas las entradas del almacenamiento local utilizando window.localStorage.clear().