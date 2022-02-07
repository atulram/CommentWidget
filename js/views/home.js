import utility from '../utility/utility.js'
import commentClass from '../views/comment.js'

class Home {
    constructor(){
        this.comments = null;
        this.html = null;
        this.init();
    }

    init(){
        this.getData()
        this.render()
        this.addEvents()
    }

    getData(){
        this.comments = utility.getFromLocalStorage('mycomments');
    }

    traverseComments(parentId, tillParent=false){
        if(tillParent) parentId = parentId.split('-').slice(0,-1).join('-')
        var currentComment = this.comments
        if(parentId){
            var lastId = ''
            parentId.split('-').forEach(element => {
                var key = lastId ? lastId+'-'+element: element
                if(currentComment[key]) {
                    currentComment = currentComment[key].replies
                    lastId = key
                }
            
            });
        }

        return currentComment
    }

    getNewCommentSpace(parentId){
        var newChildId = '1'
        var currentComment = this.traverseComments(parentId)
        var keysListSorted = Object.keys(currentComment).map(item=>parseInt(item.split('-').slice(-1)[0])).sort()

        if(keysListSorted.length>0){
            newChildId = (keysListSorted.slice(-1)[0]+1).toString()
        }

        var newId =  parentId ? parentId+'-'+newChildId : newChildId
        currentComment[newId] = null
        return {currentComment, newId}
    }

    insertComment(comment, parentId=null){
        let {currentComment, newId} = this.getNewCommentSpace(parentId)
        currentComment[newId] = new commentClass(newId, comment, this)
    }

    render(){
        var template = `
        <div>
        <div>
            <input class="input-box" type="text">
            <button class="comment mr-1">comment</button>
        </div>
        <div id="comments"></div>
        </div>
        `
        this.html = utility.getHTML(template)
        const container = document.querySelector('#maincontainer')
        container.appendChild(this.html)
        this.generateComments();
    }

    addEvents(){
        this.handleComment()
    }

    handleComment(){
        var commentButton = this.html.querySelector('.comment')
        if(commentButton){
            utility.addEventListener(commentButton, 'click', (event)=>{
                var text = this.html.querySelector('.input-box').value.trim()
                this.html.querySelector('.input-box').value = ''
                if(text){
                    this.insertComment(text)
                    this.generateComments()
                }
                
            });
        }
    }

    handleReply(text, parentId){
        this.insertComment(text, parentId)
        this.generateComments()
    }

    handleDelete(id){
        var currentComment = this.traverseComments(id, true)
        delete currentComment[id]
        this.generateComments()
    }

    generateComments(){
        var commentsContainer = this.html.querySelector('#comments')
        commentsContainer.innerHTML = ""
        this.recurseComments(this.comments, commentsContainer)
        // this.updateLocalStorage()

    }

    recurseComments(comments, commentsContainer){
        var keysList = Object.keys(comments)
        keysList.sort((key1, key2)=>{
            return (comments[key1].commentTime>comments[key2].commentTime) ? -1:1
        })
        keysList.forEach(item =>{
            commentsContainer.appendChild(comments[item].html)
            if(comments[item].replies != null){
                this.recurseComments(comments[item].replies, commentsContainer)
            }
        });
        return commentsContainer
    }

    updateLocalStorage(){
        utility.resetLocalStorage('mycomments', this.comments)
    }

}

export default Home;