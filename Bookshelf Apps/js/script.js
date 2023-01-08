function objekBook(idBuku,judul,penulis,tahun,isCompleted){
    return{
        idBuku,judul,penulis,tahun,isCompleted
    }
}
const Render = 'render'
const SAVED_EVENT = 'saved'
const STORAGE_KEY = 'BookShelf'
const arrayBook = []
function generateId(){
    return + new Date()
}

// Make ELement
function makeElement(objek){
    const {idBuku, judul,penulis,tahun,isCompleted} = objek

    
    const judulElement = document.createElement('h4')
    const penulisElement = document.createElement('p')
    const tahunElement = document.createElement('p')
    const author = document.createElement('h5')
    author.innerText = 'Author :'
    const year = document.createElement('h5')
    year.innerText = 'Tahun :'
    

    judulElement.innerText = judul
    judulElement.classList.add('judul')
    penulisElement.innerText = penulis
    penulisElement.classList.add('penulis')
    tahunElement.innerText = tahun

    const authorContainer = document.createElement('div')
    authorContainer.append(author,penulisElement)
    authorContainer.classList.add('author')

    const yearContainer = document.createElement('div')
    yearContainer.append(year,tahunElement)
    yearContainer.classList.add('tahun')

    const containerElement = document.createElement('div')
    containerElement.classList.add('element')

    containerElement.append(judulElement,authorContainer,yearContainer)

    const inner = document.createElement('div')
    inner.classList.add('inner')
    inner.setAttribute('id', idBuku)

    inner.append(containerElement)
    

    if (isCompleted) {

        const undoButton = document.createElement('button');
        undoButton.classList.add('undo');
        undoButton.addEventListener('click', function () {
            undo(idBuku)
        })

        const editButton = document.createElement('button');
        editButton.classList.add('edit');
        editButton.addEventListener('click', function () {
            editBook(idBuku)
            
        })
    
        const trashButton = document.createElement('button');
        trashButton.classList.add('delete')
        trashButton.addEventListener('click', function () {
            deleteBook(idBuku)
        })
        
        const divButton = document.createElement('div')
        divButton.classList.add('button')
        divButton.append(undoButton,editButton,trashButton)
        
        inner.append(divButton)

    } else {
    
        const checkButton = document.createElement('button');
        checkButton.classList.add('checklist');
        checkButton.addEventListener('click', function () {
            finished(idBuku)
        })

        const editButton = document.createElement('button');
        editButton.classList.add('edit');
        editButton.addEventListener('click', function () {
            editBook(idBuku)
        })

        const trashButton = document.createElement('button');
        trashButton.classList.add('delete');
        trashButton.addEventListener('click', function () {
            deleteBook(idBuku)
        })
        const divButton = document.createElement('div')
        divButton.classList.add('button')
        divButton.append(checkButton,editButton,trashButton)
        
        inner.append(divButton)
    }
    return inner

}

function addBook(){
    const judul = document.getElementById('judulBuku').value
    const penulis = document.getElementById('penulis').value
    const tahun = document.getElementById('tahun').value


    const generatedID = generateId()
    const objek = objekBook(generatedID,judul,penulis,tahun,false)
    arrayBook.push(objek)
    document.dispatchEvent(new Event(Render))
    saveData()
    Swal.fire({
        title: 'Add Book',
        text : 'Berhasil DiTambahkan',
        type : 'success'
        
    })
}



// custom event
document.addEventListener(Render, function(){
    const rakBlmTerbaca = document.querySelector('.belum')
    rakBlmTerbaca.innerHTML = ''
    const rakTerbaca = document.querySelector('.Sudah')
    rakTerbaca.innerHTML = ''

    for (item of arrayBook){
        const element = makeElement(item)
        if (item.isCompleted){
            rakTerbaca.append(element)
        }else {
            rakBlmTerbaca.append(element)
        }
    }
    console.log(arrayBook)

})


const columnSearch = document.querySelector('.columnSearch')
const searchInput = document.querySelector('#searchBook')
searchInput.addEventListener('input', function(e){
    e.preventDefault()
    searchBook()
})


function searchBook(){
    const searchValue = searchInput.value.toLocaleLowerCase()
    const judul = document.querySelectorAll('.judul')

    judul.forEach(function(item){
        const itemList = item.firstChild.textContent.toLocaleLowerCase() 

        if (itemList.includes(searchValue)){
            item.parentElement.parentElement.style.display = 'flex'
        }else {
            item.parentElement.parentElement.style.display = 'none'
        }
    })

}

// editBook


function editBook(idBuku){
    const displayForm = document.querySelector('.editForm')
    displayForm.style.display = 'flex'
    const editForm = document.getElementById('editForm')
    const target = findIndexBook(idBuku)
    const cencelButton = document.querySelector('.cencel')
    editForm.addEventListener('submit', function(e){
        e.preventDefault()
        e.stopPropagation()
        const editJudul = document.querySelector('#editJudul').value
        const editPenulis = document.querySelector('#editPenulis').value
        const editTahun =document.querySelector('#editTahun').value

        arrayBook[target].judul = editJudul
        arrayBook[target].penulis = editPenulis
        arrayBook[target].tahun = editTahun

        document.dispatchEvent(new Event(Render))
        saveData()
        Swal.fire({
            title: 'Edit Book',
            text : 'Buku Berhasil Di Ubah',
            type : 'success'
        })
        displayForm.style.display = 'none'

    })
    
    cencelButton.addEventListener('click', function(){
        displayForm.style.display = 'none'
        Swal.fire({
            title: 'Edit Book',
            text : 'Batal Edit Buku',
            type : 'info'
        })
    })
}


// conten load
document.addEventListener('DOMContentLoaded', function(){
    const form = document.getElementById('Bookshelf')
    form.addEventListener('submit', function(e){
        e.preventDefault()
        addBook()
    })
    if (isStorageExist()) {
        loadDataFromStorage();
    }
})


// button function

// find book
function findBook(idBuku){
    for (const item of arrayBook){
        if (item.idBuku === idBuku){
            return item
        }
    }
    return null

}

// find index
function findIndexBook(idBuku){
    for (const index in arrayBook){
        if (arrayBook[index].idBuku === idBuku){
            return index
        }
    }
    return -1
}

// finish
function finished(idBuku){
    const target = findBook(idBuku)
    if(target == null) return

    target.isCompleted = true
    document.dispatchEvent(new Event(Render))
    saveData()
    Swal.fire({
        title: 'Selesai DiBaca',
        text : 'Buku Di Pindahkan Ke rak Selesai Di Baca',
        type : 'success'   
    })
}

// undo read
function undo(idBuku){
    const target = findBook(idBuku)
    if(target == null) {
        return
    }
    target.isCompleted = false
    document.dispatchEvent(new Event(Render))
    saveData()
    Swal.fire({
        title: 'Baca Ulang',
        text : 'Berhasil DiTambahkan ke Rak Belum Terbaca',
        type : 'success'
    })
}

// delete book
function deleteBook(idBuku){
    const target = findIndexBook(idBuku)
    if(target == -1) {
        return
    }
    Swal.fire({
        title: 'Anda Yakin ingin menghapus buku ini?',
        showDenyButton: true,
        confirmButtonText: 'Yes',
        denyButtonText: `No`,
      }).then((result) => {
        if (result.isConfirmed) {
            arrayBook.splice(target, 1)
            document.dispatchEvent(new Event(Render))
            saveData()
            Swal.fire('Berhasil Menghapus', '', 'success')
        } else if (result.isDenied) {
            Swal.fire('Batal Menghapus', '', 'info')
        }
      })
    
}

// Local Storage

function isStorageExist(){
    if (typeof (Storage) === undefined) {
      alert('Browser kamu tidak mendukung local storage')
      return false
    }
    return true
}


function saveData() {
    if (isStorageExist()) {
      const parsed = JSON.stringify(arrayBook)
      localStorage.setItem(STORAGE_KEY, parsed)
      document.dispatchEvent(new Event(SAVED_EVENT))
    }   
}
function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY)
    let data = JSON.parse(serializedData)
    if (data !== null) {
        for (const todo of data) {
          arrayBook.push(todo);
        }
    }
    document.dispatchEvent(new Event(Render))
}