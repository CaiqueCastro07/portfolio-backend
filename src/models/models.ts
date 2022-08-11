interface ResponseData {
    error?:string    
}

interface Task{
    task:string,
    priority:number,
    done:Boolean
}

interface TaskChange{
    task:string
}

interface PriorityChange{
    priority:number
}

interface DateChange{
    duedate:string
}

interface ResponseType {
    message:string,
    error:boolean,
    data:{},
    status:number
}

export {
    ResponseData,
    Task,
    DateChange,
    PriorityChange,
    TaskChange,
    ResponseType
}