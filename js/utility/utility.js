class Utility{
    addEventListener(element, event, handler){
        element.addEventListener(event, handler)
    }

    getHTML(template){
        var templateCreator = document.createElement('div')
        templateCreator.innerHTML = template.trim();
        return templateCreator.firstChild;
    }

    getFromLocalStorage(key){
        if(localStorage.getItem(key)==null){
            localStorage.setItem(key, "{}");
        }
        return JSON.parse(localStorage.getItem(key));
    }

    resetLocalStorage(key, value){
        localStorage.set(key, JSON.stringify(value));
    }


}

export default new Utility();