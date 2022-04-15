# Simple Machines

## Summary

Simple Machines is some kind game, maybe... I dunno yet. The core logic is simply building blocks for building autonomous agents, with the hope that some kind of interesting gameplay can be developed out of it given the right application.

A `bot` consists of `parts` and a `program`. On each step, the `bot` will receive inputs based on its `parts` list and execute its `program`, resulting in an `action plan`.

Executing `parts` costs `energy`, which must be stored or generated. Parts that require more `energy` than available will be inactive.

Executing the `program` taxes its CPU, generating `heat`. All `bots` are equipped with regulators that require a sufficient `cooldown period` between `program` executions. More sophisticated `programs` require more computational power, which generates more `heat` output, requiring a longer `cooldown period`.

## Parts

`Parts` consist of two varieties: sensory and output. Sensory parts provide additonal
The inputs fed into a `program` as well as the possible `action plans` that can be generated depend on what `parts` are equipped on a bot. There are many possibilities for parts. Some examples:

> ### Movement
>
> Wheels, tracks, or other mechanisms for moving about the terrain.
>
> **output**: Move the bot to a specified coordinate at a given speed. The `energy` cost required to perform this `action plan` is proportional to the mass of the bot and the desired speed of movement.

> ### Gyroscope
>
> Sensor that allows for proprioceptive awareness.
>
> **input**: Current velocity and bearing

> ### Radar
>
> Probe your surroundings for objects of interest.
>
> **input**: A list of objects found within the sensor range, including their position. The `energy` cost is proportional to the area scanned. The heat generated from processing sensor inputs is proportional to the area being scanned.

> ### Grabber
>
> Grab and release objects within grasping range.
>
> **input**: Whether the Grabber is open or closed, and its contents, if any. Grabbing an object costs `energy` proportional to the target's mass, and grabbed objects are added to your `bot`'s total mass. You may only grab a single object with a Grabber, but you can have multiple Grabber parts equipped on a bot.
>
> **output**: Grab an object at a given coordinate, or release a currently grabbed object at a given coordinate.

> ### Generator
>
> Generate `energy` over time.
>
> **output**: Generate `energy` at the cost of `heat`. The amount of `heat` generated is proportional to the amount of `energy` generated.

> ### Memory
>
> Store and retrieve data to use as input for `program` executions.
>
> **input**: Retrieve aribtrary data as additional `program` inputs stored from the previous execution. Uses `energy` proportional to the size of the data.
>
> **output** Store arbitrary data as additional `program` inputs to be used in the next execution. Uses `heat` proportional to the size of the data.

## Programs

TODO
