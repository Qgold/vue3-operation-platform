
export const lazyDirective = {
  mounted(el,binding) {
    const io = new IntersectionObserver(
        ([entry])=>{
            if(entry.isIntersecting){
                el.src = binding.value
                el.classList.add('fade-in')
                io.disconnect()
            }
        },
        {
            rootMargin:'50px 0px'
        }
    )
    io.observe(el)    
  },
}