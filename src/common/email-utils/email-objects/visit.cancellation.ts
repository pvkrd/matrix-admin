export class VisitCancellationEmail {
    subject: string;
    providerName: string;
    appointmentDate: string;
    address: string;
    reason: string;
    products: string;
}

export class ProviderSameDayCancellationEmail {
    subject: string;
    providerName: string;
    appointmentDate: string;
    address: string;
    reason: string;
    products: string;
    proximityRangeInMiles: string;
    availableProvidersDetails: string;
}
