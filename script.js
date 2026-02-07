document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-todo');
  const tugas = document.getElementById('tugas');
  const tanggal = document.getElementById('tanggal');
  const cari = document.getElementById('cari');
  const filter = document.getElementById('filter');
  const daftar = document.getElementById('daftar');
  const kosong = document.getElementById('kosong');

  let todos = JSON.parse(localStorage.getItem('catatan')) || [];

  function simpan() {
    localStorage.setItem('catatan', JSON.stringify(todos));
  }

  function tampilkan() {
    daftar.innerHTML = '';

    const kata = cari.value.toLowerCase();
    const jenis = filter.value;

    const hasil = todos.filter(item => {
      const cocokCari = item.tugas.toLowerCase().includes(kata);
      if (jenis === 'semua') return cocokCari;
      if (jenis === 'belum') return cocokCari && !item.selesai;
      if (jenis === 'selesai') return cocokCari && item.selesai;
      return cocokCari;
    });

    if (hasil.length === 0) {
      kosong.style.display = 'block';
    } else {
      kosong.style.display = 'none';
    }

    hasil.forEach(item => {
      const li = document.createElement('li');
      if (item.selesai) li.classList.add('completed');

      li.innerHTML = `
        <input type="checkbox" class="check" ${item.selesai ? 'checked' : ''} data-id="${item.id}">
        <div class="task">
          <div class="task-name ${item.selesai ? 'completed' : ''}">${item.tugas}</div>
          <div class="task-date">→ ${new Date(item.tanggal).toLocaleDateString('id-ID')}</div>
        </div>
        <button class="hapus" data-id="${item.id}">Hapus</button>
      `;
      daftar.appendChild(li);
    });
  }

  // Tambah tugas baru
  form.addEventListener('submit', e => {
    e.preventDefault();

    const errTugas = document.getElementById('err-tugas');
    const errTanggal = document.getElementById('err-tanggal');

    let oke = true;

    if (!tugas.value.trim()) {
      errTugas.style.display = 'block';
      oke = false;
    } else {
      errTugas.style.display = 'none';
    }

    if (!tanggal.value) {
      errTanggal.style.display = 'block';
      oke = false;
    } else {
      errTanggal.style.display = 'none';
    }

    if (oke) {
      todos.push({
        id: Date.now(),
        tugas: tugas.value.trim(),
        tanggal: tanggal.value,
        selesai: false
      });
      simpan();
      tampilkan();
      form.reset();
    }
  });

  // Centang selesai / belum
  daftar.addEventListener('change', e => {
    if (e.target.classList.contains('check')) {
      const id = Number(e.target.dataset.id);
      const todo = todos.find(item => item.id === id);
      if (todo) {
        todo.selesai = e.target.checked;
        simpan();
        tampilkan();
      }
    }
  });

  // Hapus
  daftar.addEventListener('click', e => {
    if (e.target.classList.contains('hapus')) {
      const id = Number(e.target.dataset.id);
      todos = todos.filter(item => item.id !== id);
      simpan();
      tampilkan();
    }
  });

  // Filter & pencarian
  cari.addEventListener('input', tampilkan);
  filter.addEventListener('change', tampilkan);

  // Tampilkan pertama kali
  tampilkan();
});