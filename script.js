// Initialize Bootstrap components (optional if using data-bs attributes only, but good practice)
document.addEventListener('DOMContentLoaded', function () {
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            navbar.classList.add('shadow-sm');
        } else {
            navbar.classList.remove('shadow-sm');
        }
    });

    // Close mobile menu when a link is clicked
    const navLinks = document.querySelectorAll('.nav-link');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    const bsCollapse = new bootstrap.Collapse(navbarCollapse, { toggle: false });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navbarCollapse.classList.contains('show')) {
                bsCollapse.toggle();
            }
        });
    });

    // Optional: Add active class to nav links on scroll
    const sections = document.querySelectorAll('section');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current) && current !== '') {
                link.classList.add('active');
            }
        });
    });
    const clientButtons = document.querySelectorAll('.client-category-btn');
    clientButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            clientButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Vision & Mission Tabs
    const vmTabButtons = document.querySelectorAll('.vm-tab-btn');
    const vmTabPanes = document.querySelectorAll('.vm-tab-pane');

    vmTabButtons.forEach(button => {
        button.addEventListener('click', function () {
            const targetTab = this.getAttribute('data-tab');

            // Remove active class from all buttons and panes
            vmTabButtons.forEach(btn => btn.classList.remove('active'));
            vmTabPanes.forEach(pane => pane.classList.remove('active'));

            // Add active class to clicked button and corresponding pane
            this.classList.add('active');
            document.getElementById(targetTab + '-content').classList.add('active');
        });
    });

    // Portfolio Category Buttons
    const portfolioButtons = document.querySelectorAll('.portfolio-category-btn');
    portfolioButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            portfolioButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
});

// Stats Counter Animation
document.addEventListener('DOMContentLoaded', () => {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = +counter.getAttribute('data-target');
                let count = 0;
                const duration = 2000; // 2 seconds animation
                const increment = target / (duration / 16); // ~60 FPS

                const updateCount = () => {
                    count += increment;
                    if (count < target) {
                        counter.innerText = Math.ceil(count);
                        requestAnimationFrame(updateCount);
                    } else {
                        counter.innerText = target;
                    }
                };

                updateCount();
                observer.unobserve(counter);
            }
        });
    }, observerOptions);

    const counters = document.querySelectorAll('.count');
    counters.forEach(counter => {
        observer.observe(counter);
    });
});

// Image Preview Modal Logic
document.addEventListener('DOMContentLoaded', function () {
    const imagePreviewModal = document.getElementById('imagePreviewModal');
    if (imagePreviewModal) {
        imagePreviewModal.addEventListener('show.bs.modal', function (event) {
            const button = event.relatedTarget;
            const imageUrl = button.getAttribute('data-bs-image');
            const modalImage = imagePreviewModal.querySelector('#modalPreviewImage');
            modalImage.src = imageUrl;
        });
    }
});

// Contact Form Submission Handler
document.addEventListener('DOMContentLoaded', function () {
    const contactForm = document.querySelector('form');

    if (contactForm && window.location.pathname.includes('kontak.html')) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault(); // Mencegah form reload halaman

            // Ambil nilai dari form
            const nama = document.getElementById('Nama').value.trim();
            const email = document.getElementById('Email').value.trim();
            const noTelp = document.getElementById('NoTelp').value.trim();
            const kota = document.getElementById('Kota').value.trim();
            const komentar = document.getElementById('Komentar').value.trim();
            const agreement = document.getElementById('exampleCheck1').checked;

            // Validasi form
            if (!nama || !email || !noTelp || !kota || !komentar) {
                showNotification('Mohon lengkapi semua field!', 'danger');
                return;
            }

            if (!agreement) {
                showNotification('Anda harus menyetujui kebijakan penyimpanan data!', 'warning');
                return;
            }

            // Validasi email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showNotification('Format email tidak valid!', 'danger');
                return;
            }

            // Buat object data form
            const formData = {
                nama: nama,
                email: email,
                noTelp: noTelp,
                kota: kota,
                komentar: komentar,
                tanggal: new Date().toLocaleString('id-ID'),
                timestamp: Date.now()
            };

            // Ambil data yang sudah ada dari localStorage
            let existingData = JSON.parse(localStorage.getItem('contactFormData')) || [];

            // Tambahkan data baru
            existingData.push(formData);

            // Simpan ke localStorage
            localStorage.setItem('contactFormData', JSON.stringify(existingData));

            // Tampilkan notifikasi sukses
            showNotification('Data berhasil disimpan! Terima kasih telah menghubungi kami.', 'success');

            // Reset form
            contactForm.reset();

            // Log data (untuk keperluan debugging)
            console.log('Data yang disimpan:', formData);
            console.log('Total data tersimpan:', existingData.length);
        });
    }
});

// Fungsi untuk menampilkan notifikasi
function showNotification(message, type = 'success') {
    // Buat element notifikasi
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3`;
    notification.style.zIndex = '9999';
    notification.style.minWidth = '300px';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    // Tambahkan ke body
    document.body.appendChild(notification);

    // Hapus notifikasi setelah 5 detik
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Fungsi untuk melihat semua data yang tersimpan (opsional - untuk admin)
function viewAllContactData() {
    const data = JSON.parse(localStorage.getItem('contactFormData')) || [];
    console.table(data);
    return data;
}

// Fungsi untuk menghapus semua data (opsional - untuk admin)
function clearAllContactData() {
    localStorage.removeItem('contactFormData');
    console.log('Semua data kontak telah dihapus');
}

// Scroll Reveal Animation
document.addEventListener('DOMContentLoaded', () => {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2 // Trigger when 20% visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show-animate');
                observer.unobserve(entry.target); // Animate once
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.animate-from-left, .animate-from-right');
    animatedElements.forEach(el => observer.observe(el));
});

const projectData = {
    "dms": {
        title: "DMS (Dinamic Medical System)",
        category: "Web Development",
        image: "src/oims-medical.jpg",
        tools: "Laravel, PHP, JavaScript, dan Bootstrap",
        deskripsi: "Rumah Sakit Umum Daerah (RSUD) merupakan Fasilitas Kesehatan Utama yang menjadi ujung tombak pemerintah didalam memberikan pelayanan kesehatan kepada masyarakat secara luas. Rumah Sakit Umum Daerah (RSUD) sebagai Fasilitas utama kesehatan mempunyai tugas yang cukup besar dimana RSUD harus dapat memberikan pelayanan kesehatan secara cepat dan tepat mengingat RSUD sebagai sarana rujukan masyarakat dalam hal pelayanan kesehatan pada masyarakat baik itu tindakan medis ataupun pelayanan obat dan peralatan medis kepada pasien. Dalam hal pelayanan kesehatan kepada masyarakat RSUD perlu meningkatkan kemampuan tenaga medis yang dimiliki. Selain kemampuan dan kecapakan Tenaga Medis yang mengawal pelayanan kesehatan, dibutuhkan juga suatu tata kelola manajemen pelayanan yang terpadu dan komprehensif dalam melayani pasien. Dimulai dari proses pendaftaran, pemeriksaan pasien sampai dengan peyampaian obat. Dalam rangka menghasilkan kinerja dan mutu kerja yang lebih baik ini, maka Rumah Sakit tidak bisa lepas untuk selalu melakukan pengembangan dan penyempurnaan system khususnya pengembangan Sistem Informasi Manajemen Rumah Sakit. Untuk memenuhi kebutuhan rumah sakit akan sistem informasi kami menghadirkan Dynamic Medical System yang merupakan sistem informasi yang mampu memenuhi kebutuhan rumah sakit terkait administrasi dan pelayanan terhadap pasien sehingga dengan penggunaan sistem informasi ini kinerja RSUD diharapkan akan lebih efisien dan efektif.",
        keunggulan: ["Aplikasi Dynamic Medical System ini dibangun di atas Sistem operasi dan Basis data bebas / open source.", "Aplikasi Dynamic Medical System merupakan aplikasi yang akan di pasang di ruangan-ruangan dan terintegasi secara On-line ataupun Semi On-line dengan ataupun tanpa jaringan internet.", "Aplikasi Dynamic Medical System yang dikembangkan dan di implementasikan yang dimaksud adalah sistem yang berbasis Web dan dirancang untuk bisa di integrasikan secara online dengan atau tanpa jaringan Internet.", "Aplikasi Dynamic Medical System harus dapat di integrasikan secara on-line dengan Asterik BPJS."]
    },
    "dpi": {
        title: "DPI (Dynamic Pharmacy Inventory)",
        category: "Web Development",
        image: "src/por011.jpg",
        tools: "Laravel, PHP, JavaScript, dan Bootstrap",
        deskripsi: "Rumah Sakit Umum Daerah (RSUD) merupakan Fasilitas Kesehatan Utama yang menjadi unjung tombak pemerintah didalam memberikan pelayanan kesehatan kepada masyarakat secara luas. RSUD sebagai Fasilitas utama kesehatan mempunyai tugas yang cukup besar dimana RSUD harus dapat memberikan pelayanan kesehatan secara cepat dan tepat mengingat RSUD sebagai sarana rujukan masyarakat dalam hal pelayanan kesehatan pada masyarakat baik itu tindakan medis ataupun pelayanan obat dan peralatan medis kepada pasien. Dalam hal pelayanan kesehatan kepada masyarakat RSUD perlu meningkatkan kemampuan tenaga medis yang dimiliki. Selain kemampuan dan kecapakan Tenaga Medis yang mengawal pelayanan kesehatan, manajemen persediaan peralatan Medis dan obat-obatan juga perlu diperhatikan mengingat hal ini sangat penting untuk menunjang pelayanan kesehatan kepada masyarakat apalagi yang bersifat urgent.<br><br>RSUD sebagai salah satu SKPD pada Pemerintah Daerah, diwajibkan untuk mengikuti peraturan perundangan yang berlaku. PP No. 71 Tahun 2010 dan Permendagri No. 64 Tahun 2013 mengharuskan Pemerintah Daerah melaksanakan Akuntansi berbasis akrual. Dan salah satu keharusan dalam praktik akuntansi berbasis akrual adalah penerapan kebijakan akuntansi persediaan yang tertuang didalam PSAP 05 pada lampiran I.06 Standar Akuntansi Pemerintahan (SAP) yang mengatur tentang kebijakan Akuntansi Persediaan. Kebijakan akuntansi persediaan yang lazim digunakan untuk saat ini adalah metode FIFO untuk menilai persediaan dan Perpectual untuk pengakuan terhadap beban persediaan yang bersifat Fast Moving. Dalam hal manajemen persediaan termasuk obat dan Barang Farmasi / bahan medis juga harus mengikuti kebijakan yang berlaku sesuai dengan Kebijakan Akuntansi Pemerintah Daerah ( KAPD) masing-masing.<br><br>Untuk itu kami menawarkan solusi dalam hal manajeman persediaan dengan Sistem Komputerisasi Persediaan Obat dan Barang Farmasi dengan menerjunkan tenaga ahli yang kami miliki untuk secara langsung melakukan pengembangan aplikasi, pelatihan dan implementasi di tempat. Oleh karena itu, kami tawarkan pekerjaan berupa Pengembangan dan Implementasi Sistem Informasi Persediaan Obat dan Bahan Medis.",
        keunggulan: ["Aplikasi persediaan obat dan bahan medis ini dibangun di atas Sistem operasi dan Basis data bebas / open source.", "Aplikasi persediaan obat dan bahan medis merupakan aplikasi yang akan di pasang di Gudang Farmasi dan Poli-poli terintegasi secara On-line ataupun Semi On-line dengan ataupun tanpa jaringan internet.", "Aplikasi persediaan obat dan bahan medis yang dikembangkan dan di implementasikan yang dimaksud adalah sistem yang berbasis Web dan dirancang untuk bisa di integrasikan secara online dengan atau tanpa jaringan Internet."]
    },
    //belum dimasukan
    "smart-opbitory": {
        title: "APP SMART OPBITORY (Optima Bisnis Dan Inventory)",
        category: "Mobile App",
        image: "src/smartopbitory.jpg",
        tools: "Cordova, JavaScript, NodeJS dan Framework7",
        deskripsi: "Aplikasi ini merupakan aplikasi Point of Sale yang berbasis Android. Aplikasi Ini dirancang untuk membantu para pelaku usaha UMKM dalam menjalankan usahanya. Para pelaku usaha UMKM bisa menggunakan gawai android mereka untuk menjalankan aplikasi ini, dengan demikian bisa menghemat pengeluaran untuk membeli komputer dan server.",
        keunggulan: ["Dikembangkan dengan ekosistem opensource, sehingga menekan biaya pengembangan dan pemeliharaan.", "Modul-modul dalam aplikasi ini sudah saling terintregrasi, sehingga memudahkan penggunaannya. Selain itu Aplikasi antar muka ini juga dirancang semenarik dan semudah mungkin penggunaannya.", "Aplikasi ini bisa digunakan pada pelbagai perangkat android, seperti handphone dan tablet."]
    },
    "apersi": {
        title: "APERSI (Aplikasi Persediaan)",
        category: "Web Development",
        image: "src/po010.jpg",
        tools: "Laravel, PHP, JavaScript, dan Bootstrap.",
        deskripsi: " Implementasi Akuntansi Berbasis akrual sesuai dengan amanat PP 71/2010 dan PMDN 59/2014 membawa dampak yang besar bagi praktik akuntansi di Pemda. Terdapat beberapa perubahan kebijakan dan kebiasaan dalam pelaksanaan dalam tata kelola keuangan daerah, dan salah satu kebijakan yang baru diterapkan adalah kebijakan terkait akuntansi persediaan pada setiap SKPD yang juga di catat dan diakui secara akrual dengan pendekatan Metode FIFO Perpetual / Periodik. Kebijakan diatas juga berdampingan dengan proses implementasi PP 27/2014 dan PMDN 19/2016 tentang BMD, karena persedian bagian dari BMD.<br><br>Guna terciptanya tata kelola persediaan yang transparan, akuntabel dan riil time maka diperlukan suatu alat bantu untuk mendokumentasikan transaksi Barang Milik Daerah dalam bentuk Persediaan.Kami Optima Multi Sinergi hadir untuk memberikan solusi teknis berupa aplikasi yang dapat implementasikan untuk menunjang pengelolaan persediaan BHP pada SKPD sesuai dengan PP 27/2014 dan kebijakan akuntansi sesuai dengan PP 71/2010 yaitu metode FIFO Perpetual / Periodik.",
        keunggulan: ["Apersi ( App-Persediaan ) ini dibangun di atas Sistem operasi dan Basis data open source.", "Apersi ( App-Persediaan ) yang dikembangkan dengan user interface yang ramah pengguna, supaya mudah untuk di operasikan. Aplikasi ini juga dikembangkan sesuai dengan Permendagri No. 108/2016 ttg Penggolongan dan kodefikasi BMD, Format Dokumen Sesuai dengan PMDN 19/2016 Format Laporan persediaan Sesuai dengan amanah PP 71/2010 dan PMDN 64/2013.", "Apersi ( App-Persediaan ) ini dirancang untuk bisa di integrasikan dengan atau tanpa jaringan internet."]
    },
    "sim_logistik": {
        title: "SIM-LOGISTIK (Sistem Informasi Logistik)",
        category: "Web Development",
        image: "src/po019.jpg",
        tools: "Laravel, PHP, JavaScript, dan Bootstrap.",
        deskripsi: "Seiring Dengan perkembangan teknologi informasi yang semakin berdaya guna bagi pekerjaan manusia dewasa ini menjadi pertimbangan utama perlunya penerapan sistem informasi di RSUD . Dengan adanya sistem informasi maka diharapkan kinerja di RSUD dapat ditingkatkan secara lebih efektif dan efisien. <br><br>Penerapan aplikasi komputer dengan menggunakan teknologi informasi sangatlah membantu bagi kepentingan manusia. Dengan penerapan aplikasi komputer maka akan mempermudah pekerjaan, kecepatan, ketepatan, efisiensi dan efektif. Berkaitan dengan inventory/persediaan logistik di RSUD maka sudah waktunya dan sangat perlu untuk segera diterapkan aplikasi komputer untuk menata usahakan logistik. RSUD memiliki berbagai jenis item logistik dan jumlah barang yang banyak, maka perlu dikendalikan dan di tata usahakan dengan aplikasi inventory/persediaan. Aplikasi komputer ini dapat dibuat secara online maupun offline dimana dimasing-masing unit atau bagian yang memerlukan bisa mengoperasionalkan aplikasi komputer ini. Aplikasi komputer ini akan dibuat sederhana dan user friendly, sehingga user dapat dengan mudah menjalankan, mengontrol, memonitoring, dan menata usahakan logistik metode persediaan First In First Out (FIFO) Perpetual. <br><br>Pemilihan metode Perpetual didalam pengakuan beban dan FIFO untuk nilai persediaan adalah dalam rangka mendukung pelaksanaan Akuntansi berbasis akrual yang dijalankan sesuai degan aturan serta perundangan yang dijadikan sebagai Dasar Hukumnya diantaranya adalah : <br><br> 1. PP No. 71 Tahun 2010 Tentang Standart Akuntansi Pemerintahan sebagai Pengganti PP No. 24 Tahun 2005;<br><br>2. Permendagri No. 64 Tahun 2013 Tentang Penerapan Standar Akuntansi Pemerintahan Berbasis Akrual Pada Pemerintah Daerah.",
        keunggulan: ["RSUD , tidak mengadakan perangkat lunak tambahan selain aplikasi komputer inventory/persediaan logistik. Oleh karena itu aplikasi komputer inventory/persediaan logistik yang akan diimplementasikan dibangun di atas Sistem operasi dan Basis data bebas / open source. Jika sistem yang akan diimplementasikan memiliki syarat untuk mengadakan perangkat lunak dasar tertentu, maka pengadaan perangkat lunak tersebut adalah kewajiban dari pelaksana pekerjaan.", "Aplikasi komputer inventory/persediaan logistik yang dikembangkan dan di implementasikan yang dimaksud adalah sistem yang berbasis Web dan dirancang untuk bisa di integrasikan secara online dengan atau tanpa jaringan Internet.", "Aplikasi komputer inventory/persediaan logistik yang akan diimplementasikan harus memiliki fitur-fitur yang lengkap layaknya aplikasi inventory pada umumnya yang siap untuk digunakan sesuai SOP yang ada. Waktu implementasi yang disediakan digunakan untuk menyesuaikan sistem agar cocok dengan konteks penggunaan dan kebijakan serta kebutuhan pada RSUD.", "Mempunyai izin usaha SBU (Sertifikat Badan Usaha) Bidang : Telematika, Subbidang : Aplikasi / Perangkat Lunak."]
    },
    "sim-aset": {
        title: "SIM-ASET (Sistem Informasi Manajemen Aset)",
        category: "Web Development",
        image: "src/po020.jpg",
        tools: "Laravel, PHP, JavaScript, dan Bootstrap.",
        deskripsi: "Praktik Akuntansi Berbasis akrual sesuai dengan amanat PP 71/2010 dan PMDN 59/2014 membawa dampak yang besar bagi praktik akuntansi di Pemda termasuk kebijakan Akuntansi Aset untuk Pemerintah Daerah. Pengamanan Aset Daerah juga menjadi catatan dan tuntutan regulasi, salah satu cara pengaamanan aset adalah secara administrasi. Hal ini juga tertuang didalam PP 27 Tahun 2014 dan PMDN 19 Tahun 2016 Tentang Pengelolaan Barang Milik Daerah. Pencatatan aset yang kurang detail dan tdk update serta terpusat hanya di Bidang Aset menjadi catatan khusus dalam hal pengelolaan BMD<br><br>Guna terciptanya tata kelola Barang Milik Daerah / Aset Daerah transparan, akuntabel dan riil time maka diperlukan suatu alat bantu untuk mendokumentasikan transaksi Barang Milik Daerah. Kami Optima Consultant hadir untuk memberikan solusi teknis berupa aplikasi yang dapat implementasikan untuk menunjang pengelolaan Barang Milik Daerah pada Pengelola Barang ataupun pada Pengguna Barang dan juga pengurus barang sesuai dengan PP 27/2014 dan PMDN 19 / 2016 tentang pengelolaan BMD.",
        keunggulan: ["SIM-ASET ini dibangun di atas Sistem operasi dan Basis data open source, sehingga menekan biaya pemeliharaan dan biaya lisensi. ", "Sistem ini Dikembangkan dengan user interface yang ramah pengguna, supaya mudah untuk di operasikan serta dapat digunakan secara online maupun offline dan terintegrasi antar modul.", "Sistem ini Disesuaikan dengan Permendagri No. 108/2016 ttg Penggolongan dan kodefikasi BMD, Permendagri No. 108/2016 ttg Penggolongan dan kodefikasi BMD dan Format Dokumen Sesuai dengan PMDN 19/2016."]
    },
    "simblud": {
        title: "Simkeu-Blud (Sistem Informasi Manajemen Keuangan Badan Layanan Umum Daerah)",
        category: "Web Development",
        image: "src/por011.jpg",
        tools: "Laravel, PHP, JavaScript, dan Bootstrap.",
        deskripsi: "Amanah UU Nomor 44 Tahun 2009 tentang Rumah sakit menyebutkan bahwa Rumah sakit yang didirikan oleh Pemerintah Daerah pengelolaannya harus berbentuk Badan Layanan Umum Daerah (BLUD) yang tujuannya untuk meningkatkan kinerja dan pelayanan kesehatan kepada publik seperti yang dituangkan dalam Permendagri No. 61 Tahun 2007 tentang pedoman teknis pengelolaan BLUD. Selain itu Permendagri No.61/2007 juga menyatakan agar SKPD yang memberi pelayanan kepada publik memiliki sistem manajemen yang baik, transparan dan akuntabel serta mampu menghasilkan pelayanan bermutu bagi penggunanya.",
        keunggulan: ["Aplikasi / Sistem Informasi Manajemen Pengeloaan Keuangan BLUD RSUD di Kota Pakalongan ini dibangun di atas Sistem operasi dan Basis data bebas / open source.", "Aplikasi / Sistem Informasi Manajemen Pengeloaan Keuangan BLUD RSUD di Kota Pakalongan merupakan aplikasi yang akan di pasang di RSUD yang sudah berstatus BLUD secara On-line ataupun Semi On-line dengan ataupun tanpa jaringan internet.", "Aplikasi / Sistem Informasi Manajemen Pengeloaan Keuangan BLUD RSUD di Kota Pakalongan yang dikembangkan dan di implementasikan yang dimaksud adalah sistem yang berbasis Web dan dirancang untuk bisa di integrasikan secara online dengan atau tanpa jaringan Internet."]
    },
    "simbansos": {
        title: "SIMBANSOS (Sistem Informasi Manajemen Pengelolaan Bantuan Daerah)",
        category: "Web Development",
        image: "src/po022.jpg",
        tools: "Laravel, PHP, JavaScript, dan Bootstrap.",
        deskripsi: "Sistem Informasi Manajemen Penatausahaan Bantuan Daerah (SIM-PBD) yang kami kembangkan menggunakan tipe Desktop dengan menggunakan sistem operasi berbasis Microsoft Windows. Alasan utama pemilihan sistem operasi tersebut karena kehandalan Microsoft Windows yang tidak diragukan lagi dan merupakan sistem operasi yang umum dipakai di Indonesia, baik di lingkungan kerja swasta atau pemerintahan. <br><br>Sistem Informasi ini dibangun menggunakan perangkat lunak (software) Microsoft Visual Foxpro Release 9, suatu bahasa pemrograman yang sudah dioptimalisasi penggunaannya untuk pengolahan data dasar (database) dan mendukung sistem dengan tipe jaringan (online). Sedangkan, alasan utama digunakannya perangkat lunak (software) ini karena perkembangannya terus didukung dan dilakukan oleh Microsoft. <br><br> Media penyimpanan data dari Sistem Informasi Manajemen Penatausahaan Bantuan Daerah (SIM-PBD) menggunakan basis SQL Server sebagai mesin pengolahan data dasar (engine management database). SQL Server memiliki keunggulan dalam kapasitas penyimpanan data yang dapat mencapai bilangan jutaan serta didukung pula oleh metode Transaction Log Shipping yang dapat mengurangi kemungkinan terjadinya kejadian kehilangan data. Selain daripada itu, mesin pengolahan data dasar ini juga dilengkapi dengan kata sandi (password) bagi keamanan dari data-data yang tersimpan.",
        keunggulan: ["1", "2", "3"]
    },
    "sipanda": {
        title: "SIPANDA (Sistem Informasi Pendapatan Daerah)",
        category: "Web Development",
        image: "src/po023.jpg",
        tools: "Laravel, PHP, JavaScript, dan Bootstrap.",
        deskripsi: "Sistem Informasi Dashboard Pendapatan Daerah adalah suatu sistem informasi yang menampilkan data-data meliputi pajak daerah, retribusi daerah, Pajak Bumi dan Bangunan, dan pendapatan lain-lain yang dipungut oleh Dinas Pendapatan Daerah, yang semua informasinya dapat divisualisasikan dalam bentuk Grafik, Diagram dan laporan yang informatif, menarik dan dapat diakses dimana saja dengan piranti elektronik melalui internet sehingga mampu memberikan informasi yang diperlukan oleh semua pihak yang berkepentingan.<br><br>Sistem Informasi Dashboard Pendapatan Daerah ini berbasis sistem operasi android, di mana nantinya akan terpasang pada Play Store. Play Store tersebut dapat diinstal pada semua piranti elektronik (Handphone, Smartphone, PDA) dengan basis operasi Android. Dari Plays Store Aplikasi Sistem Informasi Dasboard Pendapatan Daerah dapat didownload secara gratis, sehingga user dan para pengguna Sistem Informasi Dashboard Pendapatan Daerah dapat mengakses semua informasi yang dihasilkan oleh Sistem Informasi Dashboard Pendapatan Daerah. Proses entry data dapat dilakukan secara langsung melalui sinkronisasi (pengambilan data langsung dari database) dari aplikasi Sistem Informasi Pendapatan Daerah, Sistem Informasi Pajak Bumi dan Bangunan (PBB), dan Sistem Informasi Komputerisasi yang lain yang ada dan terinstall di Dinas Pendapatan Daerah. Data yang telah dimasukkan akan otomatis ditampilkan dalam bentuk visual (Grafik, Diagram, Laporan) yang menarik dan dinamis sebagai informasi yang akan diberikan kepada pihak pemerintah daerah / masyarakat yang membutuhkan.",
        keunggulan: ["Aplikasi Sistem Informasi Dashboard Pendapatan Daerah ini sangat mudah dalam pengoperasiannya, users tinggal men-download aplikasi Sistem informasi Pendapatan Daerah ini di dalam aplikasi Google Play Store melalui semua piranti elektronik berbasis Android. ", "Aplikasi Sistem Informasi Dashboard Pendapatan Daerah ini divisualisasikan dalam bentuk grafik 2D dan 3D, diagram, flowchart dan laporan yang dikemas informatif, menarik dan dinamis, sehingga menambah nilai lebih bagi Dinas Pendapatan Daerah selaku Dinas yang menggunakan aplikasi ini.", "Berbekal basis android, aplikasi Sistem Informasi Dashboard Pendapatan Daerah ini dapat diakses oleh semua piranti elektronik berbasis android dengan menggunakan jaringan internet.", "Aplikasi Sistem Informasi Dashboard Pendapatan Daerah ini dapat dengan mudah disinkronisasikan dengan Semua Sistem Informasi lainnya (dengan persetujuan), sehingga mampu memberikan visualisasi laporan yang lebih beragam dan komprehensif."]
    },
    "perdin": {
        title: "SIM-PERDIN (Sistem Informasi Manajemen Perjalanan Dinas)",
        category: "Web Development",
        image: "src/po027.jpg",
        tools: "Laravel, PHP, JavaScript, dan Bootstrap.",
        deskripsi: "Sistem Informasi Manajemen Pengelolaan Keuangan BLUD RSUD di Kota Pakalongan ini dibangun di atas Sistem operasi dan Basis data bebas / open source.",
        keunggulan: ["Aplikasi / Sistem Informasi Manajemen Pengeloaan Keuangan BLUD RSUD di Kota Pakalongan ini dibangun di atas Sistem operasi dan Basis data bebas / open source.", "Aplikasi / Sistem Informasi Manajemen Pengeloaan Keuangan BLUD RSUD di Kota Pakalongan merupakan aplikasi yang akan di pasang di RSUD yang sudah berstatus BLUD secara On-line ataupun Semi On-line dengan ataupun tanpa jaringan internet.", "Aplikasi / Sistem Informasi Manajemen Pengeloaan Keuangan BLUD RSUD di Kota Pakalongan yang dikembangkan dan di implementasikan yang dimaksud adalah sistem yang berbasis Web dan dirancang untuk bisa di integrasikan secara online dengan atau tanpa jaringan Internet."]
    },
    "spakad": {
        title: "SPAKAD (Sistem Informasi Keuangan Desa)",
        category: "Web Development",
        image: "src/po025.jpg",
        tools: "Laravel, PHP, JavaScript, dan Bootstrap.",
        deskripsi: "Sistem Informasi Manajemen Pengelolaan Keuangan BLUD RSUD di Kota Pakalongan ini dibangun di atas Sistem operasi dan Basis data bebas / open source.",
        keunggulan: ["Aplikasi ini dikembangkan menggunakan bahasa Pemrograman PHP dengan database MySql pemilihan bahasa dan database tersebut dikarenakan memiliki beberapa keunggulan di bandingkan dengan bahasa atau database lainya. PHP merupakan bahasa pemrograman dan database MySql merupakan software free yang tidak diharuskan menggunakan Lisensi, sehingga lebih murah dalam hal pengembangan dan bebas dari benturan hak paten dari vendor.", "modul-modul dalam aplikasi ini sudah saling terintregrasi, sehingga memudahkan penggunaannya.", "Aplikasi ini yang dikembangkan dengan teknologi berbasis Web dan dirancang untuk bisa di integrasikan secara online dengan atau tanpa jaringan Internet."]
    },
    "lhp": {
        title: "SIM-LHP (Sistem Informasi Manajemen Laporan Hasil Pemeriksaan)",
        category: "Web Development",
        image: "src/po026.jpg",
        tools: "Laravel, PHP, JavaScript, dan Bootstrap.",
        deskripsi: "Dewasa ini tuntutan masyarakat terhadap penyelenggaraan pemerintahan yang bersih, adil, transparan dan akuntabel semakin meningkat. Hal tersebut harus disikapi secara serius dan sistematis. Untuk mewujudkan tuntutan tersebut, segenap jajaran penyelenggara negara dalam tatanan eksekutif, legislatif, dan yudikatif harus bersinergi dan berkomitmen untuk menegakkan good governance dan clean government. Dengan adanya komitmen pemerintah untuk mewujudkan good governance khususnya pemberantasan korupsi, kolusi, dan nepotisme, maka kinerja penyelenggaraan organisasi pemerintah menjadi perhatian pemerintah untuk dilakukan peningkatan performa, salah satunya melalui penerapan sistem pengawasan yang efektif dengan meningkatkan peran dan fungsi dari Inspektorat Daerah Kota Kupang sebagai Aparat Pengawas Intern Pemerintah (APIP).",
        keunggulan: ["Aplikasi ini dikembangkan menggunakan bahasa Pemrograman PHP dengan database MySql pemilihan bahasa dan database tersebut dikarenakan memiliki beberapa keunggulan di bandingkan dengan bahasa atau database lainya. PHP merupakan bahasa pemrograman dan database MySql merupakan software free yang tidak diharuskan menggunakan Lisensi, sehingga lebih murah dalam hal pengembangan dan bebas dari benturan hak paten dari vendor.", "modul-modul dalam aplikasi ini sudah saling terintregrasi, sehingga memudahkan penggunaannya.", "Aplikasi ini yang dikembangkan dengan teknologi berbasis Web dan dirancang untuk bisa di integrasikan secara online dengan atau tanpa jaringan Internet."]
    },
    "Laundry": {
        title: "App Laundry",
        category: "Mobile App",
        image: "src/applaundry.jpg",
        tools: "Cordova, JavaScript, NodeJS dan Framework7",
        deskripsi: "App Laundry merupakan aplikasi berbasis android yang dirancang khusus untuk kebutuhan UMKM jasa laundry.",
        keunggulan: ["Dikembangkan dengan ekosistem opensource, sehingga menekan biaya pengembangan dan pemeliharaan.", "modul-modul dalam aplikasi ini sudah saling terintregrasi, sehingga memudahkan penggunaannya.", "Aplikasi ini bisa digunakan pada pelbagai perangkat android, seperti handphone dan tablet."]
    },
    "opnicare": {
        title: "APP OPNICARE (Optima Clinic Care)",
        category: "Mobile App",
        image: "src/opnicareapp.jpg",
        tools: "Cordova, JavaScript, NodeJS dan Framework7",
        deskripsi: "Loading...",
        keunggulan: ["Loading...", "Loading...", "Loading...", "Loading..."]
    },
    "siJantan": {
        title: "Si Jantan (Sistem Informasi Jalan dan Jembatan di Dinas PU dan Penataan Ruang Kabupaten Demak)",
        category: "Web Development",
        image: "src/sijantan.jpg",
        tools: "Laravel, PHP, JavaScript, dan Bootstrap.",
        deskripsi: "SiJantan merupakan Sistem Informasi Jalan dan Jembatan di Dinas PU dan Penataan Ruang Kabupaten Demak. Sistem ini digunakan untuk mempermudah dalam pengelolaan tata ruang. Sistem ini dirancang dengan tampilan ramah pengguna sehingga pengguna yang awam terhadap perangkat lunak (software) sistem informasi akan dengan mudah menggunakannya.",
        keunggulan: ["Media penyimpanan data dari Si Jantan menggunakan basis data MySql sebagai mesin pengolahan data dasar (engine management database). MySql memiliki keleluasaan karena Open Source.", "Sistem ini Dikembangkan dengan user interface yang ramah pengguna, supaya mudah untuk di operasikan serta dapat digunakan secara online maupun offline dan terintegrasi antar modul.", "Sistem SiJantan yang dikembangkan dan di implementasikan yang dimaksud adalah sistem yang berbasis Web dan dirancang untuk bisa di integrasikan secara online dengan jaringan Internet."]
    },
    "siJari": {
        title: "Si Jari (Sistem Informasi Jaringan dan Irigasi Kabupaten Demak)",
        category: "Web Development",
        image: "src/sijantan.jpg",
        tools: "Laravel, PHP, JavaScript, dan Bootstrap.",
        deskripsi: "SiJari merupakan Sistem Informasi Jaringan dan Irigasi Kabupaten Demak. Sistem ini digunakan untuk mempermudah dalam pengelolaan tata ruang. Sistem ini dirancang dengan tampilan ramah pengguna sehingga pengguna yang awam terhadap perangkat lunak (software) sistem informasi akan dengan mudah menggunakannya.",
        keunggulan: ["Media penyimpanan data dari Si Jari menggunakan basis data MySql sebagai mesin pengolahan data dasar (engine management database). MySql memiliki keleluasaan karena Open Source.", "Sistem ini Dikembangkan dengan user interface yang ramah pengguna, supaya mudah untuk di operasikan serta dapat digunakan secara online maupun offline dan terintegrasi antar modul.", "Sistem SiJari yang dikembangkan dan di implementasikan yang dimaksud adalah sistem yang berbasis Web dan dirancang untuk bisa di integrasikan secara online dengan jaringan Internet."]
    },
    "komisi": {
        title: "KOMISI (Koperasi Mobile Terintegrasi)",
        category: "Web Aplication",
        image: "src/komisi.jpg",
        tools: "Laravel, PHP, JavaScript, dan Bootstrap.",
        deskripsi: "Komisi (Koperasi Mobile Terintegrasi) adalah sistem informasi yang dirancang untuk mempermudah dalam pengelolaan tata ruang. Sistem ini dirancang dengan tampilan ramah pengguna sehingga pengguna yang awam terhadap perangkat lunak (software) sistem informasi akan dengan mudah menggunakannya.<br><br>Koperasi merupakan salah satu badan usaha yang membantu masyarakat dalam mendapatkan kebutuhan ekonomi dana yang mudah saat membutuhkan, sebagai salah satu bentuk organisasi yang penting dalam meningkatkan pertumbuhan ekonomi, kerjasama yang baik dan kepercayaan penuh dari masyarakat umum terhadap segala bentuk pelayanan.",
        keunggulan: ["Media penyimpanan data dari Komisi menggunakan basis data MySql sebagai mesin pengolahan data dasar (engine management database). MySql memiliki keleluasaan karena Open Source.", "Sistem ini Dikembangkan dengan user interface yang ramah pengguna, supaya mudah untuk di operasikan serta dapat digunakan secara online maupun offline dan terintegrasi antar modul.", "Sistem Komisi yang dikembangkan dan di implementasikan yang dimaksud adalah sistem yang berbasis Web dan dirancang untuk bisa di integrasikan secara online dengan jaringan Internet."]
    },
    "simkeu": {
        title: "SIM KEUANGAN RUMAH SAKIT",
        category: "Web Aplication",
        image: "src/por015.jpg",
        tools: "Laravel, PHP, JavaScript, dan Bootstrap.",
        deskripsi: "SIM KEUANGAN RUMAH SAKIT adalah sistem informasi yang dirancang untuk mempermudah dalam pengelolaan tata ruang. Sistem ini dirancang dengan tampilan ramah pengguna sehingga pengguna yang awam terhadap perangkat lunak (software) sistem informasi akan dengan mudah menggunakannya.<br><br>Koperasi merupakan salah satu badan usaha yang membantu masyarakat dalam mendapatkan kebutuhan ekonomi dana yang mudah saat membutuhkan, sebagai salah satu bentuk organisasi yang penting dalam meningkatkan pertumbuhan ekonomi, kerjasama yang baik dan kepercayaan penuh dari masyarakat umum terhadap segala bentuk pelayanan.",
        keunggulan: ["Media penyimpanan data dari SIM KEUANGAN RUMAH SAKIT menggunakan basis data MySql sebagai mesin pengolahan data dasar (engine management database). MySql memiliki keleluasaan karena Open Source.", "Sistem ini Dikembangkan dengan user interface yang ramah pengguna, supaya mudah untuk di operasikan serta dapat digunakan secara online maupun offline dan terintegrasi antar modul.", "Sistem SIM KEUANGAN RUMAH SAKIT yang dikembangkan dan di implementasikan yang dimaksud adalah sistem yang berbasis Web dan dirancang untuk bisa di integrasikan secara online dengan jaringan Internet."]
    },
    "simremu": {
        title: "SIM REMUNERASI (Sistem Informasi Manajemen Remunerasi Gaji dan Tunjangan)",
        category: "Web Aplication",
        image: "src/por015.jpg",
        tools: "Laravel, PHP, JavaScript, dan Bootstrap.",
        deskripsi: "SIM REMUNERASI (Sistem Informasi Manajemen Remunerasi Gaji dan Tunjangan) adalah sistem informasi yang dirancang untuk mempermudah dalam pengelolaan tata ruang. Sistem ini dirancang dengan tampilan ramah pengguna sehingga pengguna yang awam terhadap perangkat lunak (software) sistem informasi akan dengan mudah menggunakannya.<br><br>Koperasi merupakan salah satu badan usaha yang membantu masyarakat dalam mendapatkan kebutuhan ekonomi dana yang mudah saat membutuhkan, sebagai salah satu bentuk organisasi yang penting dalam meningkatkan pertumbuhan ekonomi, kerjasama yang baik dan kepercayaan penuh dari masyarakat umum terhadap segala bentuk pelayanan.",
        keunggulan: ["Media penyimpanan data dari SIM REMUNERASI menggunakan basis data MySql sebagai mesin pengolahan data dasar (engine management database). MySql memiliki keleluasaan karena Open Source.", "Sistem ini Dikembangkan dengan user interface yang ramah pengguna, supaya mudah untuk di operasikan serta dapat digunakan secara online maupun offline dan terintegrasi antar modul.", "Sistem SIM REMUNERASI yang dikembangkan dan di implementasikan yang dimaksud adalah sistem yang berbasis Web dan dirancang untuk bisa di integrasikan secara online dengan jaringan Internet."]
    }

};


const careerData = {
    "android": {
        title: "Android Developer",
        image: "src/Android_Dev_2022.png",
        description: `
            <h5 class="fw-bold">Deskripsi Pekerjaan:</h5>
            <p>Kami mencari Android Developer yang berbakat untuk bergabung dengan tim kami. Anda akan bertanggung jawab untuk mengembangkan dan memelihara aplikasi mobile Android berkualitas tinggi.</p>
            <h5 class="fw-bold mt-3">Kualifikasi:</h5>
            <ul class="mb-0">
                <li>Have experience using Java/Kotlin/Android Native.</li>
                <li>Solid understanding of the full mobile application development.</li>
                <li>Full-Time position and freelance(s) are available.</li>
            </ul>
        `
    },
    "fullstack": {
        title: "Junior Fullstack Programmer",
        image: "src/Junior Fullstack Programmer.jpg",
        description: `
            <h5 class="fw-bold">Deskripsi Pekerjaan:</h5>
            <p>Bergabunglah dengan tim kami sebagai Junior Fullstack Programmer. Anda akan terlibat dalam pengembangan aplikasi web dari sisi front-end hingga back-end.</p>
            <h5 class="fw-bold mt-3">Kualifikasi:</h5>
            <ul class="mb-0">
                <li>Menguasai Web Programming (Framework Laravel) dan Database;</li>
                <li>Memiliki Kemampuan Dasar Melakukan Pemrograman Aplikasi Pendukung (Contoh: Javascript, Python, Bash Script Atau Yang Lainnya);</li>
                <li>Mampu Dalam Mengoperasikan Sistem Operasi Open Source (Contoh: Linux, MacOS dll);</li>
                <li>Memiliki Kemampuan Dasar Dalam Tata Kelola Data Center Dan Perangkatnya (Contoh: VPS/Virtual Box/VMware/Docker);</li>
                <li>Memiliki Inisiatif dan Antusiasme Dalam Melakukan Riset Hal Baru (Dunia Pemrograman);</li>
            </ul>
        `
    },
    "impl-jatim": {
        title: "System Implementator - Jawa Timur",
        image: "src/System Implementator - Jawa Timur.jpg",
        description: `
            <h5 class="fw-bold">Deskripsi Pekerjaan:</h5>
            <p>Kami membuka kesempatan bagi Anda yang berdomisili di Jawa Timur untuk menjadi System Implementator. Tugas Anda meliputi instalasi, konfigurasi, dan pelatihan pengguna sistem.</p>
            <h5 class="fw-bold mt-3">Kualifikasi:</h5>
            <ul class="mb-0">
                <li>Menguasai llmu Dasar Tentang Perangkat Komputer/Sejenisnya Beserta Aplikasi Yang Berkaitan;</li>
                <li>Menguasai Minimal Satu (1) Bahasa Pemrograman (Web/Mobile);</li>
                <li>Memahami llmu Jaringan Komputer;</li>
                <li>Menguasai Tahapan Troubleshooting dan Maintenance Perangkat Komputer;</li>
            </ul>
        `
    },
    "impl-papua": {
        title: "System Implementator - Papua",
        image: "src/System Implementator - Papua.jpg",
        description: `
            <h5 class="fw-bold">Deskripsi Pekerjaan:</h5>
            <p>Kami membuka kesempatan emas bagi putra-putri daerah Papua untuk bergabung sebagai System Implementator. Anda akan menjadi ujung tombak implementasi sistem kami di wilayah Papua.</p>
            <h5 class="fw-bold mt-3">Kualifikasi:</h5>
            <ul class="mb-0">
                <li>Menguasai llmu Dasar Tentang Perangkat Komputer/Sejenisnya Beserta Aplikasi Yang Berkaitan;</li>
                <li>Menguasai Minimal Satu (1) Bahasa Pemrograman (Web/Mobile);</li>
                <li>Memahami llmu Jaringan Komputer;</li>
                <li>Menguasai Tahapan Troubleshooting dan Maintenance Perangkat Komputer;</li>
                <li>Diutamakan berdomisili di Papua.</li>
            </ul>
        `
    }
}

function showCareerDetail(id) {
    const data = careerData[id];
    if (data) {
        document.getElementById('careerModalTitle').innerText = data.title;
        document.getElementById('careerModalImage').src = data.image;
        document.getElementById('careerModalContent').innerHTML = data.description;
    }
}
