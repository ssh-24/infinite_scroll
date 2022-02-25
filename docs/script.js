;(function () {
  'use strict'

  const get = (target) => {
    return document.querySelector(target)
  }
  
  let page = 1 // 현재 페이지
  const limit = 10 // 한번에 가져올 데이터 수
  let total = limit // 지금까지 불러온 데이터 수, 처음은 limit으로 초기화
  const end = 100 // 총 데이터 수
  const $posts = get('.posts')
  const $loader = get('.loader')
  

  // 데이터 화면 view에 출력
  const showPosts = (posts) => {
    posts.forEach((post) => {
      // class = "post" 인 div 생성
      const $post = document.createElement('div')
      $post.classList.add('post')
      $post.innerHTML = `
          <div class="header">
            <div class="id">${post.id}.</div>
            <div class="title">${post.title}</div>
          </div>
          <div class="body">${post.body}</div>
      `
      // 자식에 추가
      $posts.appendChild($post)
    })
  }

  
  // 데이터 GET 요청
  const getPosts = async (page, limit) => {
    // API URL로 Fetch
    // const API_URL = `https://jsonplaceholder.typicode.com/posts`; // 데이터 전부(100개)
    const API_URL = `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=${limit}`;
    
    const response = await fetch(API_URL)
    if (!response.ok) {
      throw new Error('에러가 발생했습니다.')
    }
    return await response.json()
  }
  

  // Loading Element 노출
  const showLoader = () => {
    $loader.classList.add('show')
  }
  // Loading Element 숨김
  const hideLoader = () => {
    $loader.classList.remove('show')
  }
  
  // 데이터 로드
  const loadPosts = async (page, limit) => {
    showLoader()
    try {
    const response = await getPosts(page, limit);
    showPosts(response);
    } catch (error) {
      console.error(error.message);
    } finally {
      hideLoader()
    }
  }


  // Scroll Event 처리
  const handleScroll = () => {
    const {scrollTop, scrollHeight, clientHeight} = document.documentElement

    // 끝까지 도달 시 Scroll Event 제거
    if (total === end) {
      window.removeEventListener('scroll', handleScroll)
      return
    }

    // 간격을 주기 위해서 5px정도 빼준 값과 비교
    if (scrollTop + clientHeight >= scrollHeight - 5) {
      page++
      total += limit
      loadPosts(page, limit)
      return
    }
  }


  window.addEventListener('DOMContentLoaded', () => {
    loadPosts(page, limit);
    window.addEventListener('scroll', handleScroll)
  })
})()
