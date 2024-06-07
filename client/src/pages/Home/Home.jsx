import React from 'react'
import { history, useModel } from '@umijs/max'
import { Anchor } from 'antd'
import { SwapRightOutlined } from '@ant-design/icons'
import './Home.less'

import Logo from '@/assets/common/logo.png'
import Security from '@/assets/images/security.png'

const Home = () => {
  const handleToLogin = () => {
    history.push('/manage')
  }

  const { defaultName } = useModel('Global')

  const productList = [
    {
      title: '分享笔记/学习心得',
      desc: '遨游在知识的海洋',
      img: require('@/assets/images/product1.png')
    },
    {
      title: '公开课/免费课程/励志演讲',
      desc: '在学习中提升阅历和知识获得成长与进步',
      img: require('@/assets/images/product2.png')
    },
    {
      title: '答疑解惑',
      desc: '在学习中遇到疑问时总能在这里找到高质量的解答',
      img: require('@/assets/images/product3.png')
    },
    {
      title: '优质老师云集',
      desc: `在${defaultName}app总能找到认真负责的好老师`,
      img: require('@/assets/images/product4.png')
    },
    {
      title: '日程表',
      desc: '可以清晰的记录和查看每天的学习任务安排',
      img: require('@/assets/images/product5.png')
    }
  ]

  const handleBackTop = () => {
    const c = document.documentElement.scrollTop || document.body.scrollTop
    if (c > 0) {
      window.requestAnimationFrame(handleBackTop)
      window.scrollTo(0, c - c / 15) // 设置滚动速度
    }
  }

  return (
    <div className='home'>
      <div className='home_nav'>
        <h1 className='home_logo'>
          <img src={Logo} alt='logo' />
        </h1>

        <div className='home_nav_content'>
          <Anchor
            targetOffset={100}
            direction='horizontal'
            items={[
              {
                key: 'part_1',
                href: '#part_1',
                title: '首页'
              },
              {
                key: 'part_2',
                href: '#part_2',
                title: '关于我们'
              },
              {
                key: 'part_3',
                href: '#part_3',
                title: '核心优势'
              },
              {
                key: 'part_4',
                href: '#part_4',
                title: '联系我们'
              }
            ]}
          />

          <div className='home_nav_login'>
            <span className='register'>注册</span>
            <span className='login' onClick={handleToLogin}>
              登录
            </span>
          </div>
        </div>
      </div>

      <div className='home_banner' id='part_1'></div>

      <div className='home_about' id='part_2'>
        <div className='home_title'>关于我们</div>
        <div className='home_about_content'>
          <p>
            关于学习，分享知识，专注成长。作为一款学习类APP，用户们可以分享学习笔记、学习心得、知识资料，并且在学习知识过程中遇到困惑时，及时找到答疑解惑的老师
          </p>
          <p>用户还可以通过本APP观看大学公开课、演讲、励志视频、免费课程等，在学习知识中一步步成长</p>
        </div>
      </div>

      <div className='home_product' id='part_3'>
        <div className='home_title'>产品优势</div>

        <div className='home_product_content'>
          {productList.map((item, index) => {
            return (
              <div className='home_product_item' key={item.title}>
                {index === 1 && <div className='home_product_bg' style={{ right: '50px' }}></div>}
                {index === 4 && <div className='home_product_bg' style={{ left: '50px' }}></div>}

                {index % 2 === 0 && <img className='home_product_item_img' src={item.img} alt={item.title} />}
                <div className='home_product_info'>
                  <div className='home_product_item_title'>{item.title}</div>
                  <div className='home_product_item_desc'>{item.desc}</div>
                  <div className='home_product_item_more'>
                    <span>更多</span>
                    <SwapRightOutlined color='#6C63FF' />
                  </div>
                </div>
                {index % 2 !== 0 && <img className='home_product_item_img' src={item.img} alt={item.title} />}
              </div>
            )
          })}
        </div>
      </div>

      <div className='home_contact' id='part_4'>
        <div className='home_title'>联系我们</div>
        <div className='home_contact_content'></div>
      </div>

      <div className='home_footer' id='part_5'>
        <div className='home_footer_top'>
          <div className='home_footer_top_nav'>
            <span>首页</span>
            <span>关于我们</span>
            <span>核心优势</span>
            <span>联系我们</span>
          </div>

          <div className='home_footer_top_info'>
            <h2 className='home_footer_logo'>
              <img src={Logo} alt='logo' />
            </h2>
            <div className='home_footer_top_btn' onClick={handleBackTop}>
              回到顶部
            </div>
          </div>
        </div>
        <div className='home_footer_info'>
          <a href='https://beian.miit.gov.cn/'>
            <p>
              苏ICP备2023016024号-5
              <img src={Security} alt='备案' />
              苏公网安备32031202000867号
            </p>
          </a>
          <p>Copyright 2022-2023 徐州启明星教育科技有限公司，AllRights Reserved.</p>
        </div>
      </div>
    </div>
  )
}

export default Home
