// Shorted version of the queryselector (F for find)
export function F(query, base = document.body){
    return base.querySelector(query);
}

// Shorted version of the queryselector (FA for FindAll)
export function FA(query, base = document.body){
    return base.querySelectorAll(query);
}
