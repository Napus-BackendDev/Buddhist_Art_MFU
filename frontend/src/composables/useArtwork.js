export default function useArtwork() {
  const fetchArtworks = async () => {
    const response = await fetch('http://localhost:8080/api/arts')
    const data = await response.json()
    return data
  }

  const fetchArtworksById = async (id) => {
    const response = await fetch(`http://localhost:8080/api/arts/${id}`)
    const data = await response.json()
    return data
  }

  const fetchArtworksByOwner = async (owner) => {
    const response = await fetch(`http://localhost:8080/api/arts/owner/${owner}`)
    const data = await response.json()
    return data
  }

  const fetchArtworksAdmin = async () => {
    const response = await fetch('http://localhost:8080/api/admin/arts', {
      credentials: 'include',
    })
    if (!response.ok) alert('ไม่สามารถดึงข้อมูลผลงานได้')
    const data = await response.json()
    return data
  }

  const fetchUserArtworks = async (id) => {
    const response = await fetch(`http://localhost:8080/api/user/arts/${id}`, {
      credentials: 'include',
    })
    if (!response.ok) alert('ไม่สามารถดึงข้อมูลผลงานของผู้ใช้ได้')
    const data = await response.json()
    return data
  }

  const createArtwork = async (artwork) => {
    const response = await fetch('http://localhost:8080/api/user/arts', {
      method: 'POST',
      credentials: 'include',
      body: artwork,
    })
    if (response.ok) alert('สร้างผลงานสำเร็จ')
    if (!response.ok) alert('สร้างผลงานไม่สำเร็จ')
    const data = await response.json()
    return data
  }

  const createArtworkAdmin = async (artwork) => {
    const response = await fetch('http://localhost:8080/api/admin/arts', {
      method: 'POST',
      credentials: 'include',
      body: artwork,
    })
    console.log(response)
    if (response.ok) alert('สร้างผลงานสำเร็จ')
    if (!response.ok) alert('สร้างผลงานไม่สำเร็จ')
    const data = await response.json()
    return data
  }

  const updateArtwork = async (id, artwork) => {
    const response = await fetch(`http://localhost:8080/api/user/arts/${id}`, {
      method: 'PATCH',
      credentials: 'include',
      body: artwork,
    })
    if (response.ok) alert('แก้ไขผลงานสำเร็จ')
    if (!response.ok) alert('แก้ไขผลงานไม่สำเร็จ')
    const data = await response.json()
    return data
  }

  const updateArtworkAdmin = async (id, artwork) => {
    const response = await fetch(`http://localhost:8080/api/admin/arts/${id}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json', 
      },
      body: JSON.stringify(artwork),
    })
    if (response.ok) alert('แก้ไขผลงานสำเร็จ')
    if (!response.ok) alert('แก้ไขผลงานไม่สำเร็จ')
    const data = await response.json()
    return data
  }

  const deleteArtwork = async (id) => {
    const response = await fetch(`http://localhost:8080/api/user/arts/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    })
    if (!response.ok) alert('ลบผลงานไม่สำเร็จ')
    const data = await response.json()
    return data
  }

  const deleteArtworkAdmin = async (id) => {
    const response = await fetch(`http://localhost:8080/api/admin/arts/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    })
    if (response.ok) alert('ลบผลงานสำเร็จ!')
    if (!response.ok) alert('ลบผลงานไม่สำเร็จ')
    const data = await response.json()
    return data
  }

  return {
    fetchArtworks,
    fetchArtworksById,
    fetchArtworksByOwner,
    fetchArtworksAdmin,
    fetchUserArtworks,
    createArtwork,
    createArtworkAdmin,
    updateArtwork,
    updateArtworkAdmin,
    deleteArtwork,
    deleteArtworkAdmin
  }
}
