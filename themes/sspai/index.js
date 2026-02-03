import Comment from '@/components/Comment'
import { AdSlot } from '@/components/GoogleAdsense'
import { HashTag } from '@/components/HeroIcons'
import LazyImage from '@/components/LazyImage'
import LoadingCover from '@/components/LoadingCover'
import replaceSearchResult from '@/components/Mark'
import NotionPage from '@/components/NotionPage'
import ShareBar from '@/components/ShareBar'
import WWAds from '@/components/WWAds'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { loadWowJS } from '@/lib/plugins/wow'
import { isBrowser } from '@/lib/utils'
import { Transition } from '@headlessui/react'
import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

// 下面这些 import 必须确保在你的 sspai/components 文件夹里真实存在
import BlogPostArchive from './components/BlogPostArchive'
import BlogPostListPage from './components/BlogPostListPage'
import BlogPostListScroll from './components/BlogPostListScroll'
import CategoryBar from './components/CategoryBar'
import FloatTocButton from './components/FloatTocButton'
import Footer from './components/Footer'
import Header from './components/Header'
import Hero from './components/Hero'
import LatestPostsGroup from './components/LatestPostsGroup'
import { NoticeBar } from './components/NoticeBar'
import PostAdjacent from './components/PostAdjacent'
import PostCopyright from './components/PostCopyright'
import PostHeader from './components/PostHeader'
import { PostLock } from './components/PostLock'
import PostRecommend from './components/PostRecommend'
import SearchNav from './components/SearchNav'
import SideRight from './components/SideRight'
import CONFIG from './config'
import { Style } from './style'

/**
 * 基础布局
 */
const LayoutBase = props => {
  const { children, slotTop, className } = props
  const { fullWidth, isDarkMode } = useGlobal()
  const router = useRouter()

  const headerSlot = (
    <header className="z-30 w-full">
      <Header {...props} />
      {router.route === '/' ? (
        <>
          <NoticeBar />
          <Hero {...props} />
        </>
      ) : null}
      {fullWidth ? null : <PostHeader {...props} isDarkMode={isDarkMode} />}
    </header>
  )

  const slotRight = router.route === '/404' || fullWidth ? null : <SideRight {...props} />
  const maxWidth = fullWidth ? 'max-w-[96rem] mx-auto' : 'max-w-[86rem]'

  useEffect(() => {
    loadWowJS()
  }, [])

  return (
    <div
      id='theme-heo'
      className={`${siteConfig('FONT_STYLE')} bg-[#f4f7f9] dark:bg-[#18171d] h-full min-h-screen flex flex-col scroll-smooth`}
    >
      <Style />
      {headerSlot}
      <main id='wrapper-outer' className={`flex-grow w-full ${maxWidth} mx-auto relative md:px-5`}>
        <div id='container-inner' className="w-full mx-auto lg:flex justify-center relative z-10">
          <div className={`w-full h-auto ${className || ''}`}>
            {slotTop}
            {children}
          </div>
          <div className='lg:px-2'></div>
          <div className='hidden xl:block'>{slotRight}</div>
        </div>
      </main>
      <Footer />
      {siteConfig('HEO_LOADING_COVER', null, CONFIG) && <LoadingCover />}
    </div>
  )
}

/**
 * 首页
 */
const LayoutIndex = props => {
  return (
    <LayoutBase {...props}>
      <div id='post-outer-wrapper' className='px-5 md:px-0'>
        <CategoryBar {...props} />
        {siteConfig('POST_LIST_STYLE') === 'page' ? <BlogPostListPage {...props} /> : <BlogPostListScroll {...props} />}
      </div>
    </LayoutBase>
  )
}

/**
 * 列表
 */
const LayoutPostList = props => {
  return (
    <LayoutBase {...props}>
      <div id='post-outer-wrapper' className='px-5 md:px-0'>
        <CategoryBar {...props} />
        {siteConfig('POST_LIST_STYLE') === 'page' ? <BlogPostListPage {...props} /> : <BlogPostListScroll {...props} />}
      </div>
    </LayoutBase>
  )
}

/**
 * 搜索
 */
const LayoutSearch = props => {
  const { keyword } = props
  const router = useRouter()
  const currentSearch = keyword || router?.query?.s
  return (
    <LayoutBase {...props} currentSearch={currentSearch}>
      <div id='post-outer-wrapper' className='px-5 md:px-0'>
        {!currentSearch ? <SearchNav {...props} /> : <div id='posts-wrapper'><BlogPostListScroll {...props} /></div>}
      </div>
    </LayoutBase>
  )
}

/**
 * 详情页
 */
const LayoutSlug = props => {
  const { post, lock, validPassword } = props
  const { locale, fullWidth } = useGlobal()
  const commentEnable = siteConfig('COMMENT_TWIKOO_ENV_ID') || siteConfig('COMMENT_GISCUS_REPO')

  return (
    <LayoutBase {...props}>
      <div className={`article h-full w-full bg-white dark:bg-[#18171d] border-[#e2e8f0] border rounded-2xl lg:px-2 lg:py-4 shadow-sm`}>
        {lock && <PostLock validPassword={validPassword} />}
        {!lock && post && (
          <div className='mx-auto md:w-full md:px-5'>
            <article id='article-wrapper'>
              <section className='wow fadeInUp p-5 justify-center mx-auto' data-wow-delay='.2s'>
                <NotionPage post={post} />
              </section>
              <PostAdjacent {...props} />
              <ShareBar post={post} />
              <div className='px-5'>
                <PostCopyright {...props} />
                <PostRecommend {...props} />
              </div>
            </article>
            {!fullWidth && commentEnable && (
              <div className='px-5'>
                <hr className='my-4 border-dashed' />
                <Comment frontMatter={post} />
              </div>
            )}
          </div>
        )}
      </div>
      <FloatTocButton {...props} />
    </LayoutBase>
  )
}

/**
 * 归档
 */
const LayoutArchive = props => {
  const { archivePosts } = props
  return (
    <LayoutBase {...props}>
      <div className='p-5 rounded-xl bg-white dark:bg-[#1e1e1e] shadow-sm border border-[#e2e8f0]'>
        <CategoryBar {...props} border={false} />
        <div className='px-3'>
          {Object.keys(archivePosts).map(title => (
            <BlogPostArchive key={title} posts={archivePosts[title]} archiveTitle={title} />
          ))}
        </div>
      </div>
    </LayoutBase>
  )
}

// 其他布局简单导出
const Layout404 = props => <LayoutBase {...props}><div className="text-center py-20">404 Not Found</div></LayoutBase>
const LayoutCategoryIndex = props => <LayoutBase {...props}>Category Index</LayoutBase>
const LayoutTagIndex = props => <LayoutBase {...props}>Tag Index</LayoutBase>

export {
  Layout404,
  LayoutArchive,
  LayoutBase,
  LayoutCategoryIndex,
  LayoutIndex,
  LayoutPostList,
  LayoutSearch,
  LayoutSlug,
  LayoutTagIndex,
  CONFIG as THEME_CONFIG
}
