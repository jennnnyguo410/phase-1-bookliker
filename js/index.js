document.addEventListener("DOMContentLoaded", function () {

    const bookList = document.getElementById('list')
    const showList = document.getElementById('show-panel')
    let detail = null
    const currentUser = { "id": 1, "username": "pouros" }

    fetch('http://localhost:3000/books')
        .then(res => res.json())
        .then(data => {
            displayBookName(data) //Display book names
        })
        .catch(error => {
            alert('Bad Thing!')
            console.log(error.message)
        })

    function displayBookName(books) {
        for (let i = 0; i < books.length; i++) {
            const book = books[i]
            const bookName = document.createElement('li')
            bookName.innerHTML = `${book.title}`
            bookList.appendChild(bookName)
            bookName.addEventListener('click', () => showDeatils(book))
        }
    }// Display and add clickable to the name

    function showDeatils(book) {
        console.log(book.title)
        showList.innerHTML = '' // Clear the div 
        detail = document.createElement(`div`)
        const likeBtn = document.createElement('button') //Add button
        likeBtn.textContent = 'LIKE'
        const userList = document.createElement('ul') // Add users who liked list
        let liked = false
        for (let user of book.users) {
            const userItem = document.createElement('li')
            userItem.innerText = user.username
            userList.appendChild(userItem)
            if (user.id === currentUser.id) liked = true
        } // Append the users into userlist
        likeBtn.textContent = liked ? 'UNLIKE' : 'LIKE'
        detail.innerHTML = `
        <img src = ${book.img_url} />
        <h4>${book.title}</h4>
        <h4>${book.subtitle}</h4>
        <h4>${book.author}</h4>
        <p>${book.description}</p>
        ` // Update the details div details
        detail.appendChild(userList)
        detail.appendChild(likeBtn)
        showList.appendChild(detail)
        // Append the childs 
        likeBtn.addEventListener('click', () => {
            //Change the text content
            if (liked) {
                likeBtn.textContent = 'LIKE'
                book.users = book.users.filter(user => user.id !== currentUser.id)
            } else {
                likeBtn.textContent = 'UNLIKE'
                book.users.push(currentUser)
            }
            updateLike(book, userList)
            liked = !liked// cb function to add the cureent like
        }) // Add event listener to likeBtn
    } // End of showDeatils

    function updateLike(book, userList) {
        fetch(`http://localhost:3000/books/${book.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify({ users: book.users })
        })
            .then(res => res.json())
            .then(data => {
                userList.innerHTML = '';
                for (let user of book.users) { // Refill the user list with updated users
                    const userItem = document.createElement('li')
                    userItem.innerText = user.username
                    userList.appendChild(userItem);
                }
            })

            .catch(error => {
                alert('Bad things!');
                console.log(error.message);
            })
    } // End of updateLike

}); // End of page loaded
