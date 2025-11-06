import AdminPaymentDetail from '../components/AdminPaymentDetail'

interface PageParams {
  paymentId: string
}

const Page = async ({ params }: { params: Promise<PageParams> }) => {
  const { paymentId } = await params

  return <AdminPaymentDetail paymentId={paymentId} />
}

export default Page
