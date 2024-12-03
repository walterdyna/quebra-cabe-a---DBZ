var board = document.querySelector('#board')

class Result {
    constructor() {

    }
    day = ''
    moves = ''
}

class PreviousResults {

    constructor(result) {
        let localData = localStorage.getItem('results')


        if(localData != null) {
            
            this.stats = JSON.parse(localStorage.getItem('results'))
            this.stats.push(result)
            localStorage.setItem('results', JSON.stringify(this.stats))

        } else {
            this.stats.push(result)
            localStorage.setItem('results', JSON.stringify(this.stats))

        }
    }

    stats = []
}

class Board {

    constructor() {
        this.shuffled = false

        this.completed = false

        this.board = [
                [1, 2, 3, 4],
                [5, 6, 7, 8],
                [9, 10, 11, 12],
                [13, 14, 15, 0],
        ]

        this.completeBoard = [
                [1, 2, 3, 4],
                [5, 6, 7, 8],
                [9, 10, 11, 12],
                [13, 14, 15, 0],
        ]

        this.blockImg = {}

        this.moves = 0
    }

    shuffle = () => {
        document.querySelector('#play').setAttribute('disabled', '')
        let i =0
        var lastRand = 0

        do {

            let movableBlocks = document.querySelectorAll(".movable")
            let qtdMovableBlocks = movableBlocks.length
            
            
            let rand = Math.floor(Math.random() * qtdMovableBlocks)
            /*
            do {
                rand = Math.floor(Math.random() * qtdMovableBlocks)
            } while (rand == lastRand)*/

            let blockToMove = movableBlocks[rand]
            


            this.moveBlock(blockToMove, true)

            lastRand = rand

            i++
            

        } while (i < 500)

        this.moves = 0

        this.shuffled = true

        this.counterMoves()
        

    }

    verifyBoard = () => {
        if(JSON.stringify(this.board) == JSON.stringify(this.completeBoard)) {
            document.querySelector('#finished').style.display = 'flex'
            this.completed = true   
            
            this.store()

        }
            
    }

    counterMoves = () => {

        let counterMoves = document.querySelector('#movesCounter')

        if(counterMoves.style.display != 'flex') {
            counterMoves.style.display = 'flex'
        }

        if(this.moves != 1)
            counterMoves.innerText = `${this.moves} MOVIMENTOS`
        else 
            counterMoves.innerText = `${this.moves} MOVIMENTO`

    }

    setBlockImg = () => {
        let i
        let j
        let horizontal
        let vertical
        let aux = 1
        for(i = 0; i < this.board.length; i++) {
            for(j = 0; j < this.board.length; j++) { 
                horizontal = j*120
                vertical = i*120
                tab.blockImg[aux] = `-${horizontal}px -${vertical}px`
                aux++
                // console.log(horizontal, vertical)
            }
        }
    }

    imgUrl = (imgNumber) =>  `./img/img${imgNumber}.jpg`
    

    moveBlock = (target, shuffling = 0) => {

        if(this.completed == true) {
            let alert = document.querySelector('#alert')
            alert.style.display = 'flex'
            return
        }
        
        let id = target.getAttribute('id')
        let block = document.querySelector(`#${id}`)
        let emptyBlock = document.querySelector('#emptyBlock')
        
        let targetLine = parseInt(target.getAttribute('i'))
        let targetColumn = parseInt(target.getAttribute('j'))

        let emptyBlockLine = parseInt(emptyBlock.getAttribute('i'))
        let emptyBlockColumn = parseInt(emptyBlock.getAttribute('j'))

        this.board[emptyBlockLine][emptyBlockColumn] = this.board[targetLine][targetColumn]
        this.board[targetLine][targetColumn] = 0

        block.setAttribute('id', 'emptyBlock')
        emptyBlock.setAttribute('id', id)

        this.moves += 1

        this.drawBoard()
        this.counterMoves()

        if(shuffling == false)
            this.verifyBoard()
        

    }

    drawBoard = () => {

        this.setBlockImg()
        board.innerHTML = ''
        let i
        let j 
        let emptyBlock


        for(i = 0; i < this.board.length; i++) {
            for(j = 0; j < this.board.length; j++) { 
                if(this.board[i][j] == 0) {
                    emptyBlock = this.board[i][j]
                }
            }
        }

        let horizontal = 0
        let vertical = 0

        
        for(i = 0; i < this.board.length; i++) {
            for(j = 0; j < this.board.length; j++) {
                horizontal = j*120
                vertical = i*120
             

                let block = document.createElement('div')
                block.className = 'block'
                block.setAttribute('id', `block__${i}i${j}j`)
                block.setAttribute('i', `${i}`)
                block.setAttribute('j', `${j}`)
              
                board.appendChild(block)

                // block.innerHTML = this.board[i][j]

                if(this.board[i][j] == 0) {
                    // block.style.border = 'none'
                    block.setAttribute('id', `emptyBlock`)
                    let div = document.createElement('div')
                    block.appendChild(div)
                } else {
                    let tagImg = `<img alt='img' class='imgBlock' style = 'object-position: ${this.blockImg[this.board[i][j]]}' src = '${this.imgUrl(imgNumber)}'/>`
                    
                    block.innerHTML += tagImg

                }
                

                var upperBlock = null
                var lowerBlock = null
                var leftBlock = null
                var rightBlock = null

                if(i != 0) 
                    upperBlock = this.board[i-1][j]
                
                if(i != 3)
                    lowerBlock = this.board[i+1][j]
                
                if(j != 0) 
                    leftBlock = this.board[i][j-1]
                
                if(j != 3)
                    rightBlock = this.board[i][j+1]

                if( upperBlock == emptyBlock
                    || lowerBlock == emptyBlock
                    || leftBlock == emptyBlock
                    || rightBlock == emptyBlock) {

                        block.addEventListener('click', ({ target }) => {
                            if(this.shuffled == true)
                                this.moveBlock(target.parentElement)
                        })

                        block.setAttribute('class', `block movable`)
                }
                
            }
        }     

    }

    store = () => {
        let dateObj = new Date()
        let day = dateObj.getUTCDate()
        let month = dateObj.getUTCMonth()

        let result = new Result()
        result.day = `${day}/${month}`
        result.moves = this.moves
        
        let previousResults = new PreviousResults(result)

    }
}


let imgNumber = Math.floor(Math.random() * 15)
imgNumber +=1

var tab = new Board()
tab.drawBoard()


document.querySelector('#imgHelp').setAttribute('src', `./img/img${imgNumber}.jpg`)



/*cursor*/

document.addEventListener('mousemove', (e) => {
    const cursorText = document.getElementById('cursorText');
    cursorText.style.left = `${e.pageX + 10}px`;  // Ajuste de posicionamento
    cursorText.style.top = `${e.pageY + 10}px`;
    cursorText.style.display = 'block';  // Torna o texto visível enquanto o mouse se move
  });
  

  // Função para atualizar o contador de visitas
function updateVisitCount() {
    // Recupera o número de visitas do localStorage
    let visitCount = localStorage.getItem('visitCount');

    // Se não houver valor no localStorage, inicia com 1
    if (visitCount === null) {
        visitCount = 1;
    } else {
        // Se houver, incrementa o contador
        visitCount = parseInt(visitCount) + 1;
    }

    // Salva o valor atualizado no localStorage
    localStorage.setItem('visitCount', visitCount);

    // Exibe o contador de visitas na página
    document.querySelector('#visit-count').innerText = visitCount;
}

// Chama a função para atualizar o contador
updateVisitCount();
