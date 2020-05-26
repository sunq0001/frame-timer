var timer = frameTimer();

let msg = 'message'
let fn = (msg, dt)=>{
    console.log(msg)
    console.log(dt)
}

timer.run(fn, msg)

timer.delay(()=>{
    console.log('delayed run')
    timer.stop(()=>{
        console.log('stopped')
    })
}, 3000)

timer.tick(()=>{
    console.log('run tick')
}, 1000)
