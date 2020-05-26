## FrameTimer

This is a library of timer by packaging `requestAnimationFrame` so that you can use it easily.

### Download

```shell
npm install frame-timer
```

### Use In Browser

```html
<script src="./frame-timer.js"></script>
<script>
  let timer = frameTimer();
  timer.run(() => {
    console.log("executing every frame");
  });

  /* pls note that you only can use
  timer.delay() and timer.tick() after timer.run() executed
  because you have to initilize requestAnimationFrame first. */

  timer.delay(() => {
    console.log("similar usage as setTimeout");
  }, 3000);

  timer.tick(() => {
    console.log("similar usage as setInterval");
  }, 1000);

  //you can use in this way because function return instance itself
  timer.run().delay(() => {
    console.log("go to delay callback directly");
  }, 1000);

  // you can remove callback from timer.delay or timer.tick
  //so that they won't execute any more
  let fn = () => {
    console.log("running");
  };
  timer.tick(fn, 2000);
  timer.remove("fn", () => {
    console.log("tick callback fn has been removed from time queque");
  });

  timer.stop(() => {
    console.log("timer has been stopped");
  });
</script>
```

### Parameters

Of course, you can pass parameters into timer callback as well.

```js
let fn = (m) => {
  console.log(m);
};
let msg = "message";
timer.delay(fn, 3000, msg);
```

You also can directly pass parameter of the interval (`16~17ms`) between 2 frames in `timer.run()`.

```js
let msg = "message";
let fn = (msg, dt) => {
  console.log(msg);
  console.log(dt);
};
/* pls note that you only need to put your params, no need put 'dt' into run callback function because dt has been appended into arguments so that you can use it directly in callback function*/

timer.run(fn, msg);
```
