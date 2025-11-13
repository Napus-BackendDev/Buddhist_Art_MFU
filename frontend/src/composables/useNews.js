export default function useNews() {
  const fetchNews = async () => {
    const response = await fetch('http://localhost:8080/api/news')
    const data = await response.json()
    return data
  }

  const fetchNewsById = async (id) => {
    const response = await fetch(`http://localhost:8080/api/news/${id}`)
    const data = await response.json()
    return data
  }

  const fetchNewsAdmin = async () => {
    const response = await fetch('http://localhost:8080/api/admin/news', {
      credentials: 'include',
    })
    const data = await response.json()
    return data
  }

  const fetchNewsAdminById = async (id) => {
    const response = await fetch(`http://localhost:8080/api/admin/news/${id}`, {
      credentials: 'include',
    })
    if (!response.ok) alert('ไม่สามารถดึงข้อมูลข่าวสารได้')
    const data = await response.json()
    return data
  }

  const createNews = async (newsData) => {
    const response = await fetch('http://localhost:8080/api/admin/news', {
      method: 'POST',
      credentials: 'include',
      body: newsData,
    })
    if (response.ok) alert('สร้างข่าวสารใหม่เรียบร้อยแล้ว')
    if (!response.ok) alert('เกิดข้อผิดพลาดในการสร้างข่าวสาร')
    const data = await response.json()
    return data
  }

  const updateNews = async (id, formData) => {
    const response = await fetch(`http://localhost:8080/api/admin/news/${id}`, {
      method: 'PATCH',
      credentials: 'include',
      body: formData,
    })
    if (response.ok) alert('แก้ไขข่าวสารเรียบร้อยแล้ว')
    if (!response.ok) alert('เกิดข้อผิดพลาดในการแก้ไขข่าวสาร')
    const data = await response.json()
    return data
  }
  
  const deleteNews = async (id) => {
    const response = await fetch(`http://localhost:8080/api/admin/news/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    })
    if (response.ok) alert('ลบข่าวสารเรียบร้อยแล้ว')
    if (!response.ok) alert('เกิดข้อผิดพลาดในการลบข่าวสาร')
    const data = await response.json()
    return data
  }

  return { fetchNews, fetchNewsById, fetchNewsAdmin, fetchNewsAdminById, createNews, updateNews, deleteNews }
}
