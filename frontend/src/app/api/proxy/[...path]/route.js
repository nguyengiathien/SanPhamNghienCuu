/**
 * Next.js API Route - Proxy requests đến backend
 * Giúp tránh CORS issues và bảo mật API keys
 */

import { NextResponse } from 'next/server';

const BACKEND_URL =  `${process.env.NEXT_PUBLIC_API_BASE/api}` || 'http://localhost:3000/api';

export async function GET(request, { params }) {
  const resolvedParams = await params;
  return handleRequest(request, resolvedParams, 'GET');
}

export async function POST(request, { params }) {
  const resolvedParams = await params;
  return handleRequest(request, resolvedParams, 'POST');
}

export async function PUT(request, { params }) {
  const resolvedParams = await params;
  return handleRequest(request, resolvedParams, 'PUT');
}

export async function PATCH(request, { params }) {
  const resolvedParams = await params;
  return handleRequest(request, resolvedParams, 'PATCH');
}

export async function DELETE(request, { params }) {
  const resolvedParams = await params;
  return handleRequest(request, resolvedParams, 'DELETE');
}

async function handleRequest(request, params, method) {
  try {
    const { path } = params;
    const endpoint = `/${path.join('/')}`;
    
    // Lấy query string từ request
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    const url = `${BACKEND_URL}${endpoint}${queryString ? `?${queryString}` : ''}`;

    // Lấy headers từ request
    const headers = {
      'Content-Type': 'application/json',
    };

    // Copy Authorization header nếu có
    const authHeader = request.headers.get('authorization');
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    // Lấy body nếu có (cho POST, PUT, PATCH)
    let body = null;
    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      try {
        body = await request.text();
      } catch (e) {
        // No body
      }
    }

    // Forward request đến backend
    const response = await fetch(url, {
      method,
      headers,
      ...(body && { body }),
    });

    const data = await response.json();

    // Return response với status code
    return NextResponse.json(data, { 
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { message: 'Lỗi kết nối đến server', error: error.message },
      { status: 500 }
    );
  }
}

