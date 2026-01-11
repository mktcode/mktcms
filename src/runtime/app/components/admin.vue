<template>
  <div id="mktcms-admin">
    <slot />
  </div>
</template>

<style>
body {
  margin: 0;
  font-family: Arial, sans-serif;
}
#mktcms-admin {
  padding: 20px;
  background-color: #f9f9f9;
  max-width: 800px;
  margin: 0 auto;
  
  h1 {
    color: #333;
  }

  button {
    background-color: mediumseagreen;
    color: white;
    border: none;
    padding: 10px 20px;
    cursor: pointer;
    font-size: 16px;
    border-radius: 5px;
    transition: background-color 0.3s;
    &:hover {
      background-color: #45a049;
    }
  }

  input[type="text"],
  input[type="password"],
  input[type="email"],
  textarea {
    padding: 10px;
    font-size: 16px;
    margin-right: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
}
</style>