function getMaxAndIndex(values:number[]){
    let index:number=0
    let max:number=values[index]

    for (let i=1; i<values.length;i++){
        if (values[i]>max){
            max=values[i]
            index=i
        }
    }
    return {
        value: max,
        index
    }
}




const arr:number[]= [1,2,2,33,100,3,3,3,2]
console.log(getMaxAndIndex(arr))

const str = arr.map(String).join()

console.log(str)


console.log(new Array(10).fill(1))