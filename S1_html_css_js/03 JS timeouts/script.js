function countdown(num) {
  for (let i=1; i<=num; i++) // increments from 1 to num (included)
  {
    // sends all timeouts at the same time, but the smaller the number,
    // the longer the timeout
    setTimeout(console.log, 1000*i, num+1-i)
  }
  // "waits" for all timeouts to be done by using OG number
  setTimeout(console.log, (num+1)*1000, "DONE!")
}

function randomGame() {
  console.log("Generating...");
  let i = rng = 0; // initialize counter + random number

  while (rng <= 0.75)
  {
    rng = Math.random(); // generate new random num
    setTimeout(console.log, i*1000, rng); // send timeout, wait longer as i increments
    i += 1;
  }

  // default message if i == 0 (false)
  let message = "The first number we found was greater than .75."
  if (i===1) {
    message = `It took 1 try before we found a number greater than .75.`
  }
  // checks if i>0, i==1 already checked above
  else if (i) {
    message = `It took ${i} tries before we found a number greater than .75.`
  }
  // wait until all other timeouts finish, then display counter message
  setTimeout(console.log, i*1000, message);
}