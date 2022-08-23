

class Person{

    name = null

    constructor(){
        this.name = null
    }

    async setName(name){
        this.name = name
    }

    async getName(){
        return this.name
    }
}


module.exports = {  
    Person
}
