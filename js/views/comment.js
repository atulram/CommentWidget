import utility from '../utility/utility.js'

class Comment {
    constructor(id, statement, parentContext){
        this.id = id;
        this.statement = statement;
        this.parentContext = parentContext;
        this.commentTime = Date.now();
        this.likes = 0;
        this.replies = {};
        this.showMore = true;
        this.isReplyActive = false;
        this.html = null;

        this.init();
    }

    init(){
        this.render()
        this.addEvents()
    }

    render(){
        this.html = null
        var template = `
        <div class="comment-holder" style="margin-left: ${2*this.id.split('-').length-1}em;">
            <div class="text mt-1">${this.statement}</div>
            <div class="action-buttons mt-1">
                <button class="like mr-1">Likes ${this.likes}</button>
                <button class="reply mr-1">Reply</button>
                <button class="delete mr-1">Delete</button>
            </div>
            <div class="comment-box hide">
                <input class="input-box" type="text">
                <button class="comment mr-1">comment</button>
            </div>
        </div>
        `
        this.html = utility.getHTML(template)
    }

    addEvents(){
        this.handleLike()
        this.handleReplyClick()
        this.handleDelete()
        this.handleComment()
    }

    handleLike(){
        var likesElement = this.html.querySelector('.like')
        if(likesElement){
            utility.addEventListener(likesElement, 'click', event=>{
                this.likes += 1
                likesElement.innerHTML = `Likes ${this.likes}`
            })
        }
    }

    handleReplyClick(){
        var replyButton = this.html.querySelector('.reply')
        if(replyButton){
            utility.addEventListener(replyButton, 'click', event=>{
                this.isReplyActive = !this.isReplyActive
                this.html.querySelector('.reply').innerHTML = this.isReplyActive?"Close Reply":"Reply"
                this.html
                    .querySelector('.comment-box')
                    .classList.toggle('hide', !this.isReplyActive)
            });
        }
    }

    handleDelete(){
        var deleteButton = this.html.querySelector('.delete')
        if(deleteButton){
            utility.addEventListener(deleteButton, 'click', event=>{
                this.parentContext.handleDelete(this.id)
            })
        }
    }

    handleComment(){
        var commentButton = this.html.querySelector('.comment')
        if(commentButton){
            utility.addEventListener(commentButton, 'click', event=>{
                var text = this.html.querySelector('.input-box').value.trim()
                this.html.querySelector('.input-box').value = ''
                if(text.length>0) this.parentContext.handleReply(text, this.id)
            });
        }
    }

}

export default Comment;

