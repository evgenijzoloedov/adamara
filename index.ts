

class HelperFunctions{

    static getDegreeOfTwo (number:number){
        const pows_2:Record<number,number> = {2:1, 4:2, 8:3, 16:4, 32:5, 64:6, 128:7, 256:8, 512:9}
        return pows_2[number]
    }

    static getMaxAndIndex(...values:number[]):{value:number, index:number}{
        let index:number=0
        let max:number=values[index]
        for (let i=1; i<values.length;i++){
            if (Math.abs(values[i])>Math.abs(max)){
                max=Math.abs(values[i])
                index=i
            }
        }
        return {
            value: max,
            index
        }
    }

    static getCountOfMaxValue(number:number, array:number[]):number{
        return array.filter(el=> Math.abs(el)===number).length
    }
}



class Sender {


    private surname:string="111010001100000001111000001011"
    private name:string= "001101111110001100011111111"
    private patronymic:string="1011110001011100011110101110100001011011111110"

    private readonly message;


    constructor(){
        this.message = this.surname + this.name + this.patronymic
    }

    sendMessage(){
        return this.message
    }
}

class Transmitter{

    private readonly COUNT_MISTAKES:number = 3
    private readonly LENGTH_OF_BLOCK:number = 6

    private blocks:number[][] = [[]]
    private adamara:Adamara



    constructor(message:string){
        this.blocks = this.divideMessageToBlocks(message)
        this.adamara = new Adamara(message)
    }

    public transferMessage(isMistake:boolean):void{
        Printer.printMatrix("Blocks for codding: ",this.blocks)

        const encodedMessage = this.blocks.map((block)=>{
            return this.adamara.findVectorAdamara(this.adamara.stringDefenition(block),block)
        })
        Printer.printMatrix("Encoded message: ",encodedMessage)
        if (isMistake){
            const wrongMessage = this.generateMistakes(encodedMessage)
            Printer.printMatrix("Wrong matrix: ",wrongMessage)

            const fixedMessage = this.fixMistakes(wrongMessage)
            Printer.printMatrix("fixedMessage: ", fixedMessage)
        }

    }

    private generateMistakes(blocks:number[][]){
        const lenBlock = blocks[0].length

        return blocks.map(block=>{
            for (let i = 0;i<this.COUNT_MISTAKES;i++){
                const mistakePositon = Math.floor(Math.random()*(lenBlock-1))
                block[mistakePositon] = (block[mistakePositon]+1)%2
            }
            return block
        })
    }

    private fixMistakes(wrongMessage:number[][]){
        return wrongMessage.map(message=>{
            const vectorMulti = this.adamara.vec_multu_matrix(message)
            return this.adamara.defineMessage(vectorMulti)
        })
    }

    private divideMessageToBlocks(message:string):number[][]{
        const msgLen =message.length 
        let countOfBlocks

        if (!(msgLen % this.LENGTH_OF_BLOCK)){
            countOfBlocks = Math.floor(msgLen / this.LENGTH_OF_BLOCK)
        }else {
            countOfBlocks = Math.floor(msgLen / this.LENGTH_OF_BLOCK) + 1
        }

        let initBlocksForCodding:number[][] = new Array(countOfBlocks).fill(new Array(this.LENGTH_OF_BLOCK).fill(0))

        return initBlocksForCodding.map((block:number[],i:number)=>{
            return block.map((item,j)=>{
                if ( i * this.LENGTH_OF_BLOCK + j < msgLen){
                    return Number(message[i*this.LENGTH_OF_BLOCK+j])
                }
                return item
            })
        })
    }

}


class Printer {

    static printMatrix(text:string="", matrix:number[][]=[[]]):void{
        if (text == ""){
            console.log(text)
        }else{
            console.log(text)
            matrix.forEach(row=>{
                console.log(row.join(" ")+"\n")
            })
        }
    }

}

class Adamara{

    private sign:string = ""

    constructor(message:string){
        this.sign = message[0]
    }   

    findNearestPowTwo(i:number,j:number):number{
        let value:number=0
        while (Math.pow(2,value) <= i || Math.pow(2,value)<=j){
            value+=1
        }
        return Math.pow(2,value)
    }

    getValueFromAdamara(i:number,j:number):number{
        let sign = 1
        while (i>0 && j>0){
            const sizeBlock = this.findNearestPowTwo(i,j)
            const halfBlock = Math.floor(sizeBlock/2) // Look how to do better
            if (i>=halfBlock && j>=halfBlock){
                sign+=1
                i-=halfBlock
                j-=halfBlock
            }
            i>=halfBlock? i-=halfBlock:null
            j>=halfBlock? j-=halfBlock:null
        }
        return sign%2
    }

    stringDefenition(row:number[]){
        return  row.reduce((prev,next,index,array)=>{
            if (index===0) return prev
            if (next){
                prev +=Math.pow(2,array.length-1-index)
                return prev
            }
            return prev
        },0)
    }

    findVectorAdamara(stringNumber:number,message:number[]):number[]{
        const sign = message[0]
        const sizeVector=Math.pow(2,message.length-1)
        return new Array(sizeVector).fill('').map((_,index)=>{
            if (!sign){
                return this.getValueFromAdamara(stringNumber,index)
            }
            return -this.getValueFromAdamara(stringNumber,index)+1
        })
    }

    vec_multu_matrix(vector:number[]){
        const sizeOfMatrix = this.findNearestPowTwo(0,vector.length-1)
        const newVector = new Array(sizeOfMatrix).fill(0)

        for (let i=0; i<sizeOfMatrix;i++){
            for (let j=0; j<sizeOfMatrix;j++){
                let a = +vector[j]
                let b = this.getValueFromAdamara(i,j)
                a == 0 ? a=-1:null
                b == 0 ? b=-1:null
                newVector[i]+=(a*b)
            }
        }
        return newVector
    }


    defineMessage(vector:number[]){
        const {value, index} = HelperFunctions.getMaxAndIndex(...vector)
        const countOfMax = HelperFunctions.getCountOfMaxValue(value,vector)
        let message:string= ""

        if (countOfMax === 1){
            vector[index]>0?message="0": message="1"

            let space
            const addPart = String((index).toString(2))

            if (addPart.length + 1< vector.length){
                space = new Array(HelperFunctions.getDegreeOfTwo(vector.length) - addPart.length).fill("0").join("")
            }

            message+=space + addPart
        } else throw new Error("Message isn't correct")

        return message.split('').map(Number)
    }
}


const sender = new Sender()
const transmitter = new Transmitter(sender.sendMessage())

transmitter.transferMessage(true)
