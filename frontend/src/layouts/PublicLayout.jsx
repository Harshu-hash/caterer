import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ScrollProgressBar from '../components/common/ScrollProgressBar';
import FloatingWhatsApp from '../components/common/FloatingWhatsApp';
import BackToTop from '../components/common/BackToTop';
import PageTransition from '../components/common/PageTransition';

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollProgressBar />
      <Header />
      <main className="flex-1 pt-18">
        <PageTransition />
      </main>
      <Footer />
      <BackToTop />
      <FloatingWhatsApp />
    </div>
  );
}
