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
    border: 1px solid #ccc;
    border-radius: 5px;
  }

  .breadcrumbs {
    margin: 20px 0;
    color: #888;
    font-size: 1.5rem;

    a {
      color: #888;
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
    }
  }

  .files,
  .dirs {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .files a,
  .dirs a {
    display: block;
    padding: 8px 12px;
    border-radius: 4px;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }

  .files a {
    color: #555;
    background-color: #fff;
  }

  .dirs a {
    color: #fff;
    background-color: #555;
    display: flex;
    justify-content: space-between;
  }
}
</style>