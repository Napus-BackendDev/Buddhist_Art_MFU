import { createRouter, createWebHistory } from 'vue-router'
import { LayoutDashboard, Palette, User, ShoppingCart, Newspaper } from 'lucide-vue-next'

// Layouts
import HomeLayout from '@/layout/LayoutHomepage.vue'
import DefaultLayout from '@/layout/LayoutDefault.vue'
import AdminLayout from '@/layout/LayoutAdmin.vue'

// Auth Views
import Login from '@/views/auth/login.vue'

// Views
import Home from '@/views/Home.vue'
import Artwork from '@/views/Artwork.vue'
import ArtworkDetail from '@/views/ArtworkDetail.vue'
import About from '@/views/About.vue'
import New from '@/views/News.vue'
import Order from '@/views/Order.vue'

// User Views
import UserProfile from '@/views/User/profile.vue'
import ArtList from '@/views/User/Artwork/Artwork.vue'
import CreateArt from '@/views/User/Artwork/ArtworkCreate.vue'
import EditArt from '@/views/User/Artwork/ArtworkEdit.vue'

// Admin Views
import DashboardAdmin from '@/views/admin/Dashboard.vue'
import ArtworksAdmin from '@/views/admin/artwork/Artworks.vue'
import ArtworksCreate from '@/views/admin/artwork/ArtworksCreate.vue'
import OrdersAdmin from '@/views/admin/order/order.vue'
import UserAdmin from '@/views/admin/user/user.vue'
import UserAdminCreate from '@/views/admin/user/userCreate.vue'
import NewAdmin from '@/views/admin/news/News.vue'
import NewsAdminCreate from '@/views/admin/news/NewsCreate.vue'
import NewsAdminEdit from '@/views/admin/news/NewsEdit.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Auth Layout
    { path: '/auth/login', component: Login },

    // Home Layout
    { path: '/', component: HomeLayout, children: [{ path: '', name: 'home', component: Home }] },

    // Default Layout
    {
      path: '/',
      component: DefaultLayout,
      children: [
        { path: 'artwork', name: 'artwork', component: Artwork },
        { path: 'artwork/:id', name: 'artworkDetail', component: ArtworkDetail },
        { path: 'new', name: 'new', component: New },
        { path: 'about', name: 'about', component: About },
        { path: 'order', name: 'order', component: Order },
      ],
    },
    // User Profile
    {
      path: '/user',
      component: DefaultLayout,
      children: [
        { path: 'profile', name: 'profile', component: UserProfile },
        { path: 'artList', name: 'artList', component: ArtList },
        { path: 'create/art', name: 'createArt', component: CreateArt },
        { path: 'edit/art/:id', name: 'EditArt', component: EditArt },
      ],
    },
    // Admin Routes
    {
      path: '/admin',
      component: AdminLayout,
      children: [
        {
          path: 'dashboard',
          name: 'dashboard',
          meta: { icon: LayoutDashboard, title: 'Dashboard', description: 'จัดการข้อมูลแผงควบคุม' },
          component: DashboardAdmin,
        },
        {
          path: 'users',
          name: 'users',
          meta: { icon: User, title: 'User', description: 'จัดการข้อมูลผู้ใช้' },
          component: UserAdmin,
        },{
          path: 'users/create',
          name: 'CreateUser',
          meta: { icon: User, title: 'Create User', description: 'สร้างผู้ใช้ใหม่' },
          component: UserAdminCreate,
        },
        {
          path: 'artworks',
          name: 'artworks',
          meta: { icon: Palette, title: 'Artworks', description: 'จัดการข้อมูลผลงาน' },
          component: ArtworksAdmin,
        },
        {
          path: 'artworks/ArtworksCreate',
          name: 'CreateArtwork',
          meta: { icon: Palette, title: 'Create Artwork', description: 'สร้างผลงานใหม่' },
          component: ArtworksCreate,
        },
        {
          path: 'orders',
          name: 'orders',
          meta: { icon: ShoppingCart, title: 'Orders', description: 'จัดการข้อมูลคำสั่งซื้อ' },
          component: OrdersAdmin,
        },
        {
          path: 'news',
          name: 'news',
          meta: { icon: Newspaper, title: 'News', description: 'จัดการข้อมูลข่าวสาร' },
          component: NewAdmin,
        },
        {
          path: 'news/create',
          name: 'CreateNews',
          meta: { icon: Newspaper, title: 'Create News', description: 'สร้างข่าวสารใหม่' },
          component: NewsAdminCreate,
        },
        {
          path: 'news/edit/:id',
          name: 'EditNews',
          meta: { icon: Newspaper, title: 'Edit News', description: 'แก้ไขข่าวสาร' },
          component: NewsAdminEdit,
        },
      ],
    },
  ],
})

export default router
