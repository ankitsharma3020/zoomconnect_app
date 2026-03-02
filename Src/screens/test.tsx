import { current } from "@reduxjs/toolkit";

const fibonacci=(n)=>{
    if(n<=1) return n;
    sequence=[0,1]
    for(let i=2;i<n;i++){
        sequence.push(sequence[i-1]+sequence[i-2])
    }
    return sequence
}
console.log(fibonacci(10))

const fibonum=(n)=>{
 if(n===0) return 0;
    if(n===1) return 1;
    let prev=0
    let curr=1
    for(let i=0;i<=n;i++){
        let next=prev+curr
        let prev=curr
        let curr=next
    
    }
    return curr
}
console.log(fibonum(10))